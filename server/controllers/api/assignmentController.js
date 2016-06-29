'use strict'

var mongoose = require('mongoose');
var User = require('../../models/user.js'),
Assignment = require('../../models/assignment.js');

///create a assignment.js or change as assignment for right now is only a string.

//not used
exports.create = function(req, res) {
  var assignment = new Assignment(req.body);
  console.log("assignment controller");
  console.log(assignment);
  assignment.save(function(err, assignment){
    // if(!err){
    //   User.findByIdAndUpate(
    //     assignment.assignee,
    //     {$push: {"assignment":
    //     }}
    //   )
    // }
  })
  res.send({});

}


exports.read = function(req, res) {

}

exports.update = function(req, res) {

}

exports.delete = function(req, res) {

}
exports.listNow = function(req, res) {
  var now = new Date();
  var hoursNow = now.getHours();
  var minutesNow = now.getMinutes();
  var dayNow = now.getDay();

  Assignment.find({days: dayNow})
       .where('hour').equals(hoursNow)
       .where('minute').equals(minutesNow)
       // .populate('userId')
       // we might need these but I doubt it .populate('surveyTemplateId')
       .exec(function(err, docs){
         console.log(docs);
         console.log('exec assignments/now');
         if(docs){
           res.json(docs);
         }
         else
           console.log(err);
       });

}

exports.list = function(req, res) {
  Assignment.find({}, function(err, obj) {
    res.json(obj);
  })


}
