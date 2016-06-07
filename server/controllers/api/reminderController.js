'use strict'

var mongoose = require('mongoose');
var Reminder = require('../../models/reminder.js');
var ReminderResponse = require('../../models/reminderResponse.js');
var User = require('../../models/user.js');
var Message = require('../../models/message.js');
var SurveyTemplate = require('../../models/surveyTemplate.js');
var messageController = require('./messageController.js');
var moment = require('moment');
var _ = require('underscore');
var twilio = require('twilio')('ACf83693e222a7ade08080159c4871c9e3', '20b36bd42a33cd249e0079a6a1e8e0dd');
var twiml = require('twilio');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var schedule = require('node-schedule');
var Pandorabot = require('pb-node');

var botOptions = {
  url: 'https://aiaas.pandorabots.com',
  app_id: '1409612709792',
  user_key: '83a7e3b5fa60385bd676a05cb4951e98',
  botname: 'willow'
};

var bot = new Pandorabot(botOptions);

var Promise = require('bluebird');
var request = require('request');
var config = require('../../config/env/development.js');

http.listen(3852, function () {
  console.log('listening for websocket connections on *:3852');
});

// a list of currently connected sockets
var sockets = [];

io.on('connection', function (socket) {
  console.log('A user connected');
  sockets.push(socket);
  socket.on('disconnect', function () {
    console.log('User disconnected');
    sockets = _.without(sockets, sockets);
  });
});

exports.create = function(req, res) {
  var reminder = new Reminder(req.body);
  console.log("reminder controller hit");
  console.log(reminder);
  reminder.save(function(err, reminder) {
    if(!err) {
      User.findByIdAndUpdate(
        reminder.assignee,
        {$push: {"reminders": reminder}},
        {safe: true},
        function(err, user) {
          if(err) {
            console.log(err);
          }
          else {
          }
        }
      );

      // User.populate(
      //   reminder.assignee,
      //   {path: 'reminders'}, function(err, user) {
      //     if(err) {
      //       // Do something
      //     }
      //     else {
      //     }
      //   }
      // );

      /*

      twilio.sendMessage({
        to: '+15064261732',
        from: '+12898062194',
        body: reminder.title
      }, function (err, responseData) {
        if (!err) {
          console.log(responseData.from);
          console.log(responseData.body);
        }
      });*/

      res.send(reminder);
    }
  });
}

exports.receiveSMS = function (req, res) {
  console.log('Inside receiveSMS');
  var resp = new smsresponse.TwimlResponse();
  resp.message('You replied: ' + req.body.Body);
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  console.log("The client responded with: " + req.body.Body);
  console.log(JSON.stringify(req.body));
  /*Reminder.findByIdAndUpdate(
    req.body.
  )*/
  res.end(resp.toString());
}
//fire a console log statement if we recieve a response


//User.populate(req.user, {path: 'clients'}, function(err, user) {

exports.read = function(req, res) {

}

//TODO change routes so this method gets called
exports.addResponse = function(req, res) {
  console.log(req.body);
  console.log('add response triggerd');
  var reminder;

  Reminder.findByIdAndUpdate(
    req.params.id ,
    {
      $push: {
        "responses": {
          timeStamp: Date.now(),
          completed: true,
          text: req.body.text
        }
      }
    },
    {safe: true, upsert: true, new : true},
        function(err, model) {
          console.log("reminder updated");
            console.log(err);
            console.log(model);
            reminder = model;

        }
      );
  User.findById(reminder.assignee ,
    function(err, user) {
      if(!err) {
        //edit the user
        console.log("user was reached" + user);
        user.mostRecentResponse = "Worked";
        user.save;
      }
    }
  );


  res.send(model);
}







  // var status = "green";
  // if(req.body.completed)

  // User.findByIdAndUpdate(
  //   req.params.id ,
  //   {
  //     $set: {
  //       "mostRecentResponse": {
  //
  //         text: req.body.text
  //       }
  //     }
  //
  //   },
  //   {safe: true, upsert: true, new : true},
  //       function(err, model) {
  //           console.log(err);
  //           res.send(model);
  //
  //       }
  //     )
  //
  //
  // }


  //TODO make a virtual to easily display the text and bool from the last responses








//from http://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose


exports.update = function(req, res) {
  console.log('Updating reminder');
  console.log();
  console.log(req.body);
  Reminder.findOneAndUpdate({'_id': req.body._id},
  {
    title: req.body.title,
    timeOfDay: req.body.timeOfDay,
    days: req.body.days,
    hour: req.body.hour,
    minute: req.body.minute,
    seletedDates: req.body.selectedDates,
    daysOfTheWeek: req.body.daysOfTheWeek,
    author: req.body.author,
    assignee: req.body.assignee
  }, {new: true}, function (err, reminder) {
    if (!err) {
      console.log('Reminder updated: ' + reminder);
      User.findById(req.body.assignee, function (err, user) {
        if (err) {
          console.log(err);
        }

        var _user = user;
        var user = user.toObject();
        console.log('The user is: ' + JSON.stringify(user));
        console.log('The user\'s id is: ' + user._id);
        console.log('User.reminders is: ' + JSON.stringify(user.reminders));
        for (var i = 0; i < user.reminders.length; i++) {
          if (user.reminders[i]._id == req.body._id) {
            console.log(user.reminders[i]);
            user.reminders[i] = reminder;
            console.log(user.reminders[i]);
            res.send(req.body);
          }
        }
        _user.set(user);
        _user.save(function (err, doc) {
          console.log(JSON.stringify(doc));
        });
      });
    }
  })
  /*User.findByIdAndUpdate(
    req.body.assignee,
    function (err, user) {
    console.log(JSON.stringify(user));
    for (var i = 0; i < user.reminders.length; i++) {
      if (user.reminders[i]._id == req.body._id) {
        user.reminders[i] = req.body;
      }
    }
    console.log(JSON.stringify(user));
  });*/
  //res.send(req.body);
}

exports.delete = function(req, res) {
  console.log();
  console.log('Inside reminder.delete');
  console.log('id: ' + req.params.id);
  Reminder.findByIdAndRemove(
    req.params.id,
    function(err, reminder) {
      if(reminder) {
        console.log(reminder);
        User.findByIdAndUpdate(reminder.assignee,
          {$pull : {reminders: {_id: reminder._id}}},
          {new: true},
          function(err, model) {
            console.log();
            console.log('Should output a user with the specified reminder removed.');
            console.log(model);
            res.sendStatus(200);
          if(err) {
            // Do some flash message
          }
        });
      }
      else{
        console.log();
        console.log(err);
        res.sendStatus(500);
      }
    }
  );
}

exports.listNow = function(req,res) {

   var now = new Date();
   var hoursNow = now.getHours();
   var minutesNow = now.getMinutes();
   var dayNow = now.getDay();

   Reminder.find({days: dayNow})
        .where('hour').equals(hoursNow)
        .where('minute').equals(minutesNow)
        .populate('assignee')
        .populate('slack')
        .exec(function(err, docs){
          console.log(docs);
          console.log('exec reminder/now');
          if(docs){
            res.json(docs);
          }
          else
            console.log(err);
        });
}

exports.list = function(req, res) {
  Reminder.find({}, function(err, obj) {
    res.json(obj);
  })
}

exports.receiveResponse = function (req, res) {
  var _this = this;
  console.log('Begin receiveResponse');
  var resp = new twiml.TwimlResponse();
  console.log('Received SMS from: ' + req.body.From);
  res.writeHead( 200, {
    'Content-Type': 'text/xml'
  });
  console.log('The client wrote: ' + req.body.Body);
  console.log('req.body.From is: ' + req.body.From);
  User.findOne({phoneNumber: req.body.From}, function (err, _user) {
    var user = _user.toObject();
    console.log('User is: ' + JSON.stringify(_user));
    var response = new ReminderResponse({
      response: req.body.Body,
      createdBy: user._id
    });
    if (user.reminders.length != 0) {
      Reminder.findById(user.reminders[user.reminders.length - 1], function (err, _reminder) {
        var reminder = _reminder.toObject();
        if (reminder && reminder.needsResponse) {
          console.log('Adding response to reminder');
          reminder.needsResponse = false;
          reminder.responses.push({response: req.body.Body, createdBy: user._id});
          _reminder.set(reminder);
          _reminder.save(function (err, reminder) {
            console.log('Placing response into user\'s reminder');
          });
          io.emit('response', reminder);
        } else {
          console.log('Must be a response to a survey question');
            // Send response out to bot, send bot's response back to user
            // if the message contains survey id, get all responses from bot and store in survey
            console.log('Must be a response to a survey');
            console.log();
            console.log(req.body);
            console.log();
            bot.talk({that: user.pandoraBotSaid, extra: true, trace: true, sessionid: user.pandoraSessionId, client_name: user._id, input: user._id + ' ' + req.body.Body}, function (err, response) {
              if (!err) {
                console.log('The bot responded: ' + JSON.stringify(response));

                User.findByIdAndUpdate(
                  user._id,
                  {pandoraBotSaid: response.responses.join(' ')},
                  {new: true},
                  function (err, user) {
                    console.log('User updated');
                    console.log(user);
                });

                User.findOne({phoneNumber: req.body.From}, function (err, user) {
                  console.log();
                  console.log('The user is:');
                  console.log(JSON.stringify(user));
                  console.log();
                  SurveyTemplate.find({author: user.coaches[0]}, function (err, surveys) {
                    console.log('The surveys are:');
                    console.log(surveys);
                    console.log();
                    var containsId = false;
                    var survey;
                    for (var i = 0; i < surveys.length; i++) {
                      survey = surveys[i];
                      if (response.responses.join(' ').indexOf(survey._id) > -1) {
                        containsId = true;
                        break;
                      } else {
                        containsId = false;
                      }
                    }
                    console.log('The survey is:');
                    console.log(JSON.stringify(survey));
                    // if the response includes the survey id
                    console.log('Response included survey id: ' + response.responses.join(' ').indexOf(survey._id));
                    if (containsId) {
                      console.log('Survey has ended, retrieving results...');

                      User.findByIdAndUpdate(
                        user._id,
                        {pandoraBotSaid: ''},
                        {new: true},
                        function (err, user) {
                          console.log('User updated');
                          console.log(user);
                      });

                      // get the user's responses from the bot
                      console.log()
                      var count = 0;
                      for (var key = 0; key < survey.questions.length; key++) {
                        (function (question) {
                          console.log('Getting response with id: ' + survey._id + count);
                            bot.talk({extra: true, trace: true, sessionid: user.pandoraSessionId, client_name: user._id, input: 'XGET ' + survey._id + user._id + count}, function (err, response) {
                              if (!err) {
                                bot.talk({extra: true, trace: true, sessionid: user.pandoraSessionId, client_name: user._id, input: 'XDENORM ' + response.responses.join(' ')}, function (err, response) {
                                  if (!err) {
                                    // Store user's response inside survey.
                                    console.log();
                                    console.log(response.responses.join(' '));
                                    question.responses.push({
                                    from: user._id,
                                    response: response.responses.join(' '),
                                    time: Date.now()
                                  });
                                  console.log(survey.questions);
                                  var __survey = survey;

                                  SurveyTemplate.findByIdAndUpdate(
                                    survey._id,
                                    survey,
                                    {new: true},
                                    function (err, survey) {
                                      if (!err) {
                                        console.log('Survey updated');
                                        console.log(survey);
                                      } else {
                                        console.log('Error:');
                                        console.log(err);
                                      }
                                  });

                                  // add the user's responses to the survey object + update survey
                                  /*SurveyTemplate.findById(survey._id, function (err, _survey) {
                                    console.log(_survey);
                                    var survey = _survey.toObject();
                                    survey = __survey;
                                    _survey.set(survey);
                                    _survey.save(function (err, _survey) {
                                      if (!err) {
                                        console.log();
                                        console.log('Survey saved.');
                                        console.log(JSON.stringify(_survey));
                                        console.log();
                                      } else {
                                        console.log(err);
                                      }
                                    });
                                  });*/
                                  console.log();
                                } else {
                                  console.log(err);
                                }
                              });
                            } else {
                              console.log(err);
                            }
                          });
                          count++;
                        }(survey.questions[key]));
                      }
                      console.log();
                      // trim the survey id from the response and send response to user
                      var trimmedResponse = response.responses.join(' ').replace(' ' + survey._id + user._id, '');
                      twilio.sendMessage({
                        to: req.body.From,
                        from: config.phoneNumbers.reminders,
                        body: trimmedResponse
                      }, function (err, responseData) {
                        if (!err) {
                          console.log(JSON.stringify(responseData));
                        } else {
                          console.log(err);
                        }
                      });
                    } else {
                      twilio.sendMessage({
                        to: req.body.From,
                        from: config.phoneNumbers.reminders,
                        body: response.responses.join(' ')
                      }, function (err, responseData) {
                        if (!err) {
                          console.log(JSON.stringify(responseData));
                        } else {
                          console.log(err);
                        }
                      });
                    }
                  });
                });
              } else {
                console.log(err);
              }
            });
          }
      });
      user.reminders[user.reminders.length - 1].responses.push({response: req.body.Body, createdBy: user._id});
      _user.set(user);
      _user.save(function (err, __user) {
        if (err) {
          console.log(err);
        }
        console.log('Everything should be working. If not, apply hand firmly to forehead.');
        console.log(JSON.stringify(__user));
      });
    } else {
      console.log('Must be a response to a survey');
      console.log();
      console.log(req.body);
      console.log();
      bot.talk({that: user.pandoraBotSaid, extra: true, trace: true, sessionid: user.pandoraSessionId, client_name: user._id, input: user._id + ' ' + req.body.Body}, function (err, response) {
        if (!err) {
          console.log('The bot responded: ' + JSON.stringify(response));

          User.findByIdAndUpdate(
            user._id,
            {pandoraBotSaid: response.responses.join(' ')},
            {new: true},
            function(err, user) {
              console.log('User updated');
              console.log(user);
          });

          User.findOne({phoneNumber: req.body.From}, function (err, user) {
            console.log();
            console.log('The user is:');
            console.log(JSON.stringify(user));
            console.log();
            SurveyTemplate.find({author: user.coaches[0]}, function (err, surveys) {
              console.log('The surveys are:');
              console.log(surveys);
              console.log();
              var containsId = false;
              var survey;
              for (var i = 0; i < surveys.length; i++) {
                survey = surveys[i];
                if (response.responses.join(' ').indexOf(survey._id) > -1) {
                  containsId = true;
                  break;
                } else {
                  containsId = false;
                }
              }
              console.log('The survey is:');
              console.log(JSON.stringify(survey));
              // if the response includes the survey id
              console.log('Response included survey id: ' + response.responses.join(' ').indexOf(survey._id));
              if (containsId) {
                console.log('Survey has ended, retrieving results...');

                User.findByIdAndUpdate(
                  user._id,
                  {pandoraBotSaid: ''},
                  {new: true},
                  function (err, user) {
                    console.log('User updated');
                    console.log(user);
                });

                // get the user's responses from the bot
                console.log()
                var count = 0;
                console.log('THE LENGTH IS: ' + survey.questions.length);
                console.log();
                for (var key = 0; key < survey.questions.length; key++) {
                //for (var key in survey.questions) {
                  (function (question) {
                    console.log();
                    console.log('THE QUESTION IS ' + JSON.stringify(question));
                    console.log();
                    console.log('Getting response with id: ' + survey._id + count);
                    bot.talk({extra: true, trace: true, sessionid: user.pandoraSessionId, client_name: user._id, input: 'XGET ' + survey._id + user._id + count}, function (err, response) {
                      if (!err) {
                        bot.talk({extra: true, trace: true, sessionid: user.pandoraSessionId, client_name: user._id, input: 'XDENORM ' + response.responses.join(' ')}, function (err, response) {
                          if (!err) {
                            // Store user's response inside survey.
                            console.log();
                            console.log('THE USER\'S RESPONSE IS: ' + response.responses.join(' '));
                            console.log();
                            console.log('THE KEY IS: ' + key);
                            console.log('THE COUNTER IS: ' + count);
                            console.log();
                            console.log(survey.questions);
                            console.log(key);
                            console.log('The length is: ' + survey.questions.length);
                            console.log();
                            console.log('THE QUESTION IS: ' + JSON.stringify(question));
                            console.log();
                            //console.log(survey.questions[key]);
                            question.responses.push({
                              from: user._id,
                              response: response.responses.join(' '),
                              time: Date.now()
                            });
                            console.log(survey.questions);
                            var __survey = survey;
                            SurveyTemplate.findByIdAndUpdate(
                              survey._id,
                              survey,
                              {new: true},
                              function (err, survey) {
                                if (!err) {
                                  console.log('Survey updated');
                                  console.log(survey);
                                } else {
                                  console.log('Error:');
                                  console.log(err);
                                }
                            });
                            // add the user's responses to the survey object + update survey
                            /*SurveyTemplate.findById(survey._id, function (err, _survey) {
                              console.log(_survey);
                              var survey = _survey.toObject();
                              survey = __survey;
                              _survey.set(survey);
                              _survey.save(function (err, _survey) {
                                if (!err) {
                                  console.log();
                                  console.log('Survey saved.');
                                  console.log(JSON.stringify(_survey));
                                  console.log();
                                } else {
                                  console.log();
                                  console.log('An error occurred:');
                                  console.log(err);
                                  console.log();
                                  console.log('Attempted to save survey: ' + JSON.stringify(survey));
                                  console.log();
                                }
                              });
                            });*/
                            console.log();
                          } else {
                            console.log(err);
                          }
                        });
                      } else {
                        console.log(err);
                      }
                    });
                    count++;
                  }(survey.questions[key]));
                }
                console.log();
                // trim the survey id from the response and send response to user
                var trimmedResponse = response.responses.join(' ').replace(' ' + survey._id + user._id, '');
                twilio.sendMessage({
                  to: req.body.From,
                  from: config.phoneNumbers.reminders,
                  body: trimmedResponse
                }, function (err, responseData) {
                  if (!err) {
                    console.log(JSON.stringify(responseData));
                  } else {
                    console.log(err);
                  }
                });
              } else {
                twilio.sendMessage({
                  to: req.body.From,
                  from: config.phoneNumbers.reminders,
                  body: response.responses.join(' ')
                }, function (err, responseData) {
                  if (!err) {
                    console.log(JSON.stringify(responseData));
                  } else {
                    console.log(err);
                  }
                });
              }
            });
          });
        } else {
          console.log(err);
        }
      });
    }
  });
  res.end(resp.toString());
}

exports.sendReminders = function () {
  var now = new Date();
  var hoursNow = now.getHours();
  var minutesNow = now.getMinutes();
  var dayNow = now.getDay();

  console.log("Running sendReminders");
  console.log("Time is: " + now);

  Reminder.find({days: dayNow})
      .where('hour').equals(hoursNow)
      .where('minute').equals(minutesNow)
      .populate('assignee')
      .populate('slack')
      .exec(function (err, docs) {
        if (docs) {
          console.log('Printing all reminders for this time.');
          console.log(docs);
          console.log(docs.length);
          // Turns out 'int' isn't in JS... I blame C++ for ruining me
          for (var i = 0; i < docs.length; i++) {
            docs[i].needsResponse = true;
            console.log(docs[i].assignee.phoneNumber);
            var phoneNum = docs[i].assignee.phoneNumber;
            var title = docs[i].title;
            docs[i].save();
            console.log(docs[i]);
            User.findById(docs[i].author, function (err, author) {
              if (!err) {
                console.log('sending message');
                twilio.sendMessage({
                  to: phoneNum,
                  from: config.phoneNumbers.reminders,
                  body: title
                }, function (err, responseData) {
                  if (!err) {
                    console.log(JSON.stringify(responseData));
                  }
                });
              }
          });
        }
      }
    });
}

// Every minute all day every day
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
var job = schedule.scheduleJob(rule, function() {
    exports.sendReminders();
});

//need a method to find all the reminders that need to go out
