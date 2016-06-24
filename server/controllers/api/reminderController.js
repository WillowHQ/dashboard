var mongoose = require('mongoose');
var Reminder = require('../../models/reminder.js');
var User = require('../../models/user.js');
var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request');
var fs = require('fs')

exports.create = function(req, res) {
  var reminder = new Reminder(req.body);
  //SurveyTempalte.
  console.log(Reminder);
  reminder.save(function (err) {
    // if(!err) {
    //   console.log("NO Error")
    //   User.findByIdAndUpdate(
    //       reminder.assignee,
    //       {$push: {"reminders": reminder}},
    //       {safe: true},
    //       function(err, user) {
    //         if(err) {
    //           console.log(err);
    //         }
    //         else {
    //           console.log("Reminder pushed to coach.");
    //
    //         }
    //       }
    //     );
    //
    //     console.log(reminder._id);
    //     res.send(reminder);
    //
    // }
    if(!err){
      console.log("Good");
      send.sendStatus(200);
    }
    else{
      console.log("BAD");
      send.sendStatus(409);
    }
  });
}
