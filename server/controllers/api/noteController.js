'use strict'

var mongoose = require('mongoose');
var Note = require('../../models/note.js');
var User = require('../../models/user.js');
var _ = require('underscore');
var moment = require('moment');
var Promise = require('bluebird');
var request = require('request');
var winston = require('winston');


exports.create = function(req, res) {
  var note = new Note(req.body);
  winston.info("note controller hit");
  winston.info(note);

  note.save(function(err, note) {
    if(!err) {
      winston.info("NO Error")
      User.findByIdAndUpdate(
        note.assignee,
        {$push: {"notes": note}},
        {safe: true},
        function(err, user) {
          if(err) {
            winston.error(err);
          }
          else {
            winston.info("Note pushed to user.");
            winston.info("User is: " + JSON.stringify(user));
          }
        }
      );

      winston.info(note);
      res.send(note);
    }
  });
}

exports.update = function(req, res) {
  winston.info('Updating Note');
  winston.info();
  Note.findOneAndUpdate({'_id': req.body._id},
  {
    body: req.body.body,
    author:req.body.author,
    assignee:req.body.assignee
  }, {new:true}, function(err, note){
    if(!err){
      winston.info('Note updated: ' + note);
      User.findById(req.body.assignee, function(err, user){
        if(err){
          winston.info(err);
        }
        var _user = user;
        var user = user.toObject();
        winston.info('The user is: ' + JSON.stringify(user));
        winston.info('The user\'s id is: ' + user._id);
        winston.info('User.reminders is: ' + JSON.stringify(user.notes));
        for (var i = 0; i < user.notes.length; i++) {
          if (user.notes[i]._id == req.body._id) {
            winston.info(user.notes[i]);
            user.notes[i] = note;
            winston.info(user.notes[i]);
            res.send(req.body);
          }
        }
        _user.set(user);
        _user.save(function (err, doc) {
          winston.info(JSON.stringify(doc));
        });

      });
    }
    else {
      winston.error("crap");
    }

  })

}

exports.delete = function(req, res) {
  winston.info("Here note.delete");
  winston.info("id:" + req.params.id);
  Note.findByIdAndRemove(
    req.params.id,
    function(err, note){
      if(note){
        User.findByIdAndUpdate(note.assignee,
          {$pull : {'notes': note}},
          function(err, model){
            if(err){
              winston.info("Help");
            }
          });
          res.sendStatus(200);
      }
      else{
        winston.info();
        winston.error(err);
        res.sendStatus(500);
      }
    }
  )
}

exports.list = function(req, res) {
  Note.find({}, function(err, obj){
    res.json(obj);
  })
}
