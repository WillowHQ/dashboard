/*'use strict'

var mongoose = require('mongoose');
var ReminderResponse = require('../../models/reminderResponse.js');
var User = require('../../models/user.js');
var moment = require('moment');
var Reminder = require('../../models/reminder.js');


exports.create = function(req, res) {

  // Add  empty response object
  var response = new ReminderResponse(req.body);
  response.save();
  res.send(response);

}

exports.read = function(req, res) {

}

//
exports.respond = function(req, res) {

  ReminderResponse.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        responded: req.body.responded
      },
      $push: {
        response: req.body.response,
      }
    },
    {new: true},
    function(err, model) {
      if(model) {
        updateUser(model._id, model.assignee);
        res.sendStatus(200);
      }
      else
        res.sendStatus(500);
    }
  );
}

// When given a genuine response, update user
function updateUser(responseId, userId) {
  mongoose.model('User').findByIdAndUpdate(
    userId,
    {
      $set: {
        mostRecentResponse: responseId,
      },
    },
    function(err, model) {
      if(model){
        res.send(model);
      }
    }
  );
}

exports.delete = function(req, res) {
  ReminderResponse.findByIdAndRemove(
    req.params.id,
    function(err, ReminderResponse) {
      if(ReminderResponse) {
        User.findByIdAndUpdate(ReminderResponse.assignee,
          {$pull : {'ReminderResponses': ReminderResponse._id}},
          function(err, model) {
          if(err) {
            // Do some flash message
          }
        });
        res.send('success');
      }
      else{
        res.send('failure');
      }
    }
  );
}

exports.listNow = function(req,res) {

   var now = new Date();
   var hour = now.getHours();
   var minute = now.getMinutes();
   var day = now.getDay();

   ReminderResponse.find({days: day})
        .where('hour').equals(hours)
        .where('minute').equals(minute)
        .populate('assignee')
        .populate('slack')
        .exec(function(err, docs){
          if(docs && !err)
            res.json(docs);
          else
            res.sendStatus(500);
    });

}

exports.list = function(req, res) {
  ReminderResponse.find({}, function(err, obj) {
    res.json(obj);
  })
}
*/
