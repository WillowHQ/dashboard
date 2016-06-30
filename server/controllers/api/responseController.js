'use strict'

var mongoose = require('mongoose');
var User = require('../../models/user.js'),

Response = require('../../models/response.js');

///create a Response.js or change as Response for right now is only a string.

//not used
exports.create = function(req, res) {
  var response = new Response(req.body);
  console.log("response controller");
  console.log(response);
  response.save(function(err, response){
    // if(!err){
    //   User.findByIdAndUpate(
    //     response.assignee,
    //     {$push: {"response":
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



exports.list = function(req, res) {
  Response.find({}, function(err, obj) {
    res.json(obj);
  })


}
