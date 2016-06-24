var mongoose = require('mongoose');
var Reminder = require('../../models/reminder.js');
var User = require('../../models/user.js');
var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request');
var fs = require('fs')

exports.create = function(req, res) {
  console.log(req.body);
  var reminder = new Reminder(req.body);
  //SurveyTempalte.
  console.log(reminder);
  console.log("what is this?");
  reminder.save(function (err) {
    if(!err){
      console.log("Good");
    }
    else{
      console.log("BAD");
      send.sendStatus(409);
    }
  });
  res.send(reminder);
};

exports.delete = function (req, res) {

};


exports.update = function (req, res){

};


exports.read = function (req, rese) {

};
