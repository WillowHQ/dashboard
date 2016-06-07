'use strict'

var mongoose = require('mongoose');
var Survey = require('../../models/survey.js');
var _ = require('underscore');
var request = require('request');
var User = require('../../models/user.js');

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
    request.post('http://localhost:8081/api/reminder', {
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
    request.post('http://localhost:8081/api/reminder/' + goal.reminder._id, {
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
