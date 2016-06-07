'use strict'

var mongoose = require('mongoose');
var User = require('../../models/user.js');
var Note = require('../../models/bio.js');
///create a bio.js or change as bio for right now is only a string.

//not used
exports.create = function(req, res) {
  var bio = new Bio(req.body);
  console.log("bio controller");
  console.log(bio);
  bio.save(function(err, bio){
    if(!err){
      User.findByIdAndUpate(
        bio.assignee,
        {$push: {"bio":
        }}
      )
    }
  })
  res.send({});

}

exports.read = function(req, res) {

}

exports.update = function(req, res) {

}

exports.delete = function(req, res) {

}

exports.list = function(req, res) {

}
