'use strict'

// Create a connect between the coach/dashboard user and a slack user.

var mongoose = require('mongoose');

// These are listed as clients within the dashboard, of because how they're managed
var Slack = require('../../models/slack.js');
var User = require('../../models/user.js');
var winston = require('winston');

// Insert a slack connection into the current user's client object
exports.insert = function(req, res) {
  User.findByIdAndUpdate(
     req.user.id,
     {$push: {"clients": {username: req.params.id, slack: null, reminders: []}}},
     {safe: true, upsert: true, new : true},
     function(err, model) {
       if(err) {

       }
       else {
         res.send((model.clients[(model.clients.length) - 1]));
       }
     }
  );
}

exports.read = function(req, res) {

}

exports.delete = function(req, res) {

}

exports.list = function(req, res) {

}

// Comment
