'use strict'

var mongoose = require('mongoose');
var Note = require('../../models/note.js');
var User = require('../../models/user.js');
var _ = require('underscore');
var moment = require('moment');
var Promise = require('bluebird');
var request = require('request');


exports.create = function(req, res) {
  var note = new Note(req.body);
  console.log("note controller hit");
  console.log(note);

  note.save(function(err, note) {
    if(!err) {
      console.log("NO Error")
      User.findByIdAndUpdate(
        note.assignee,
        {$push: {"notes": note}},
        {safe: true},
        function(err, user) {
          if(err) {
            console.log(err);
          }
          else {
            console.log("Note pushed to user.");
            console.log("User is: " + JSON.stringify(user));
          }
        }
      );

      // User.populate(
      //   reminder.assignee,
      //   {path: 'reminders'}, function(err, user) {
      //     if(err) {
      //       // Do something
      //     }
      //     else {
      //     }
      //   }
      // );
      console.log(note);
      res.send(note);
    }
  });
}



exports.update = function(req, res) {
  console.log('Updating Note');
  console.log();
  Note.findOneAndUpdate({'_id': req.body._id},
  {
    body: req.body.body,
    author:req.body.author,
    assignee:req.body.assignee
  }, {new:true}, function(err, note){
    if(!err){
      console.log('Note updated: ' + note);
      User.findById(req.body.assignee, function(err, user){
        if(err){
          console.log(err);
        }
        var _user = user;
        var user = user.toObject();
        console.log('The user is: ' + JSON.stringify(user));
        console.log('The user\'s id is: ' + user._id);
        console.log('User.reminders is: ' + JSON.stringify(user.notes));
        for (var i = 0; i < user.notes.length; i++) {
          if (user.notes[i]._id == req.body._id) {
            console.log(user.notes[i]);
            user.notes[i] = note;
            console.log(user.notes[i]);
            res.send(req.body);
          }
        }
        _user.set(user);
        _user.save(function (err, doc) {
          console.log(JSON.stringify(doc));
        });

      });
    }
    else {
      console.log("crap");
    }

  })

}

exports.delete = function(req, res) {
  console.log("Here note.delete");
  console.log("id:" + req.params.id);
  Note.findByIdAndRemove(
    req.params.id,
    function(err, note){
      if(note){
        User.findByIdAndUpdate(note.assignee,
          {$pull : {'notes': note}},
          function(err, model){
            if(err){
              console.log("Help");
            }
          });
          res.sendStatus(200);
      }
      else{
        console.log();
        console.log(err);
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
