var mongoose = require('mongoose');
var User = require('../../models/user.js');
var Reminder = require('../../models/reminder.js')
var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request');
var fs = require('fs')


exports.addUserReminder = function(req, res){
  console.log("addReminder in user.info");
  var reminder = new Reminder(req.body);
  console.log(reminder);
  User.findByIdAndUpdate(req.body.assignee,
    {$push: {"reminders": reminder}},
    {safe:true},
    function(err, user){
      if(err){
        console.log(err);
      }
      else{
        console.log("good");
      }
    });
  res.sendStatus(200);
};

exports.removeUserReminder = function (req, res) {
  console.log("removeReminder in user.info");

};


exports.updateUserReminder = function (req, res){

};


exports.readUserReminder = function (req, res) {

};
