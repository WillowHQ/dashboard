'use strict'

var mongoose = require('mongoose');
var convo = require('convo-builder');
var _ = require('underscore');
var Survey = require('../../models/survey.js');
var User = require('../../models/user.js');
var schedule = require('node-schedule');
var async = require('async');

// For websockets to send responses to the client
var io = require('socket.io')(37392);

var sockets = [];
io.on('connection', function (socket) {
  console.log('A user connected');
  sockets.push(socket);
  socket.on('disconnect', function () {
    console.log('User disconnected');
    sockets = _.without(sockets, socket);
  });
});

convo.configure({
  port: 42362,
  twilio: {
    ACCOUNT_SID: 'ACf83693e222a7ade08080159c4871c9e3',
    AUTH_TOKEN: '20b36bd42a33cd249e0079a6a1e8e0dd',
    phoneNumber: '+12044005478'
  }
});

exports.create = function (req, res) {
  var survey = new Survey(req.body);

  survey.save(function (err, survey) {
    if (!err) {
      res.json(survey);
    } else {
      res.status(400);
      res.send(err);
    }
  });
};

exports.read = function (req, res) {
  Survey.findById(req.params.survey_id, function (err, survey) {
    if (!err) {
      res.json(survey);
    } else {
      res.status(400);
      res.send(err);
    }
  });
};

exports.update = function (req, res) {
  Survey.findByIdAndUpdate(
    req.params.survey_id,
    req.body,
    {new: true},
    function (err, survey) {
      if (!err) {
        res.json(survey);
      } else {
        res.status(400);
        res.send(err);
      }
  });
};

exports.delete = function (req, res) {
  Survey.findByIdAndRemove(req.params.survey_id, function (err, survey) {
    if (!err) {
      res.json(survey);
    } else {
      res.status(400);
      res.send(err);
    }
  });
};

exports.listAll = function (req, res) {
  Survey.find(function (err, survey) {
    if (!err) {
      res.json(survey);
    } else {
      res.status(400);
      res.send(err);
    }
  });
};

exports.sendSurveys = function () {
  console.log('Sending surveys...');

  // Get the current day of the week, hour, and minute
  var now = new Date();
  var hoursNow = now.getHours();
  var minutesNow = now.getMinutes();
  var dayNow = now.getDay();

  // Get a list of all users from the db
  User.find(function (err, users) {
    if (!err) {
      // Go through all of the users
      _.each(users, function (user, userIndex) {
        // Go through all of the user's surveys
        _.each(user.surveys, function (survey, surveyIndex) {
          // If the survey is assigned for this time
          if (_.contains(survey.days, dayNow) && survey.hour == hoursNow && survey.minute == minutesNow) {
            console.log();
            console.log('Should be sending a survey');

            var greeting = 'Hi! Here\'s a survey your coach wanted me to send you.';
            var conclusion = 'Thanks for answering my questions! Enjoy the rest of your day.';

            var options = {
              provider: 'twilio',
              providerOptions: {
                phoneNumber: user.phoneNumber
              }
            };

            if (survey.isReminder()) {
              console.log();
              console.log('Sending surveys');
              console.log(survey.questions);
              console.log(options);
              // Reminders are sent without a greeting or a conclusion
              var questions = [];
              questions[0] = survey.questions[0].question;
              convo.converse(questions, options, function (err, response, questionIndex) {
                if (!err) {
                  console.log('The response was:');
                  console.log(response);
                  console.log();
                  console.log(users[userIndex]);
                  console.log();
                  console.log(users[userIndex].surveys[surveyIndex]);
                  console.log();
                  console.log(users[userIndex].surveys[surveyIndex].questions[questionIndex]);
                  console.log();

                  var response = {
                    response: response
                  };
                  users[userIndex].surveys[surveyIndex].questions[questionIndex].responses.push(response);

                  // Send response to client
                  io.emit('response', users[userIndex].surveys[surveyIndex]);

                  User.findByIdAndUpdate(users[userIndex]._id, users[userIndex], {new: true}, function (err, user) {
                    if (!err) {
                      console.log('Successfully updated user:');
                      console.log(user);
                    } else {
                      console.log('Error:');
                      console.log(err);
                    }
                  });
                  // TODO: use websockets to push response to user
                }
              });
            } else {
              // Extract all of the questions from the survey
              var questions = [];
              for (var i = 0; i < survey.questions.length; i++) {
                questions.push(survey.questions[i].question);
              }
              // Surveys are sent with a greeting or a conclusion
              convo.say(greeting, options, function (err) {
                convo.converse(questions, options, function (err, response, questionIndex) {
                  if (!err) {
                    console.log();
                    console.log(users[userIndex].survey[surveyIndex].questions[questionIndex]);

                    // Format the response correctly
                    var response = {
                      response: response
                    };

                    // Add the response to the specific user's survey
                    users[userIndex].surveys[surveyIndex].questions[questionIndex].responses.push(response);
                    console.log(users[userIndex].surveys[surveyIndex].questions[questionIndex]);
                    console.log();
                    // TODO: use websockets to push response to client side
                    // Send response to client
                    io.emit('response', users[userIndex].surveys[surveyIndex]);
                  }
                }, function () {
                  convo.say(conclusion, options, function (err) {
                    console.log('The user has been surveyed.');
                    User.findByIdAndUpdate(users[userIndex.id], users[userIndex], {new: true}, function (err, user) {
                      if (!err) {
                        console.log('User updated:');
                        console.log(user);
                      } else {
                        console.log('Error:');
                        console.log(err);
                      }
                    });
                  });
                });
              });
            }
          }
        });
      });
    }
  });


}

// Every minute all day every day
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
var job = schedule.scheduleJob(rule, function () {
  exports.sendSurveys();
});

/*var _ = require('underscore');
var request = require('request');
var User = require('../../models/user.js');
/

exports.create = function(req, res) {

  var index = 0;
  var goals = req.body.goals;
  var length = goals.length;

  req.body.goals = [];
  var survey = new Survey(req.body);

  // Create a reminder object to associat with each goal
  // Push those to the survey object, and save
  console.log(survey);
  console.log(goals);

  _.forEach(goals, function(goal) {
    request.post('http://107.170.21.178:8081/api/reminder', {
      form: {
        title: goal.action,
        timeOfDay: goal.time,
        selectedDates: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
        daysOfTheWeek: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        },
        parent: {
          id: JSON.stringify(survey._id),
          model: 'survey'
        },
        assignee: req.body.assignee,
        author: req.body.author
      }
    }, function(err, response, reminder) {
      if(err) {
        console.log(err);
        console.log(reminder);
      }
      else {
        var reminder = JSON.parse(reminder);
        var temp = {
          goal: goal.goal,
          reminder: reminder
        }
        survey.goals.push(temp);
        index++;
        if(index == length) {
          survey.save(function(err, survey) {
            if(err) {
                console.log(err);
                // flash message
            }
            else {
              attach(survey._id, survey.assignee);
              Survey.populate(survey, {
                path: 'goals',
                populate: {
                  path: 'reminder'
                }
              }, function(err, survey) {
                res.send(survey);
              });
            }
          });
        }
      }
    });
  });

  // Attach the survey objec to the User
  function attach(id, assignee) {
    User.findByIdAndUpdate(
      assignee,
      {$push: {"surveys": id}},
      {safe: true},
      function(err, user) {
        if(err) {
          console.log(err);
        }
        else {
          console.log(user);
        }
      }
    );
  }

}


exports.read = function(req, res) {

}

exports.update = function(req, res) {

  var goals = req.body.goals;
  console.log(req.body);
    // Update Referenced Reminders
  _.forEach(goals, function(goal) {
    request.post('http://107.170.21.178:8081/api/reminder/' + goal.reminder._id, {
      form: goal.reminder
    }, function(err, response, reminder) {
      console.log(reminder);
    })
  });

  Survey.findById(req.params.id, function(err,survey) {
    if(survey) {
      for (var i = 0; i < goals.length; i++) {
        survey.goals[i].goal = goals[i].goal;
      }
      survey.save(function(err) {
        if(err) {
          return handleError(err);
        }
        Survey.populate(survey, {
          path: 'goals',
          populate: {
            path: 'reminder'
          }
        }, function(err, survey) {
          res.send(survey);
        });
      })
    }
    else {
      // Send flash message
    }
  });
}

exports.delete = function(req, res) {
  var survey = new Survey(req.body);
  survey.remove(function(err, survey){
    if(!err) {
      res.send(survey);
    }
  });
}

exports.list = function(req, res) {
  Survey.find({}, function(err, obj) {
    res.json(obj);
  })
}
*/
