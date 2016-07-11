'use strict'

var mongoose = require('mongoose');
var Reminder = require('../../models/reminder.js');
var ReminderResponse = require('../../models/reminderResponse.js');
var User = require('../../models/user.js');
var Message = require('../../models/message.js');
var SurveyTemplate = require('../../models/surveyTemplate.js');
var messageController = require('./messageController.js');
var moment = require('moment');
var _ = require('underscore');
var twilio = require('twilio')('ACf83693e222a7ade08080159c4871c9e3', '20b36bd42a33cd249e0079a6a1e8e0dd');
var twiml = require('twilio');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ioSurvey = require('socket.io')(37392);
var schedule = require('node-schedule');
var Pandorabot = require('pb-node');
var winston = require('winston');

winston.info('listening for websocket connections on *:37392');

var sockets = [];

io.on('connection', function (socket) {
  winston.info('A user connected');
  sockets.push(socket);
  socket.on('disconnect', function () {
    winston.info('User disconnected');
    sockets = _.without(sockets, socket);
  });
});

var botOptions = {
  url: 'https://aiaas.pandorabots.com',
  app_id: '1409612709792',
  user_key: '83a7e3b5fa60385bd676a05cb4951e98',
  botname: 'willow'
};

var bot = new Pandorabot(botOptions);

var Promise = require('bluebird');
var request = require('request');
var config = require('../../config/env/development.js');

http.listen(55241, function () {
  winston.info('listening for websocket connections on *:55241');
});

// a list of currently connected sockets
var sockets = [];

io.on('connection', function (socket) {
  winston.info('A user connected');
  sockets.push(socket);
  socket.on('disconnect', function () {
    winston.info('User disconnected');
    sockets = _.without(sockets, sockets);
  });
});

exports.create = function(req, res) {
  var reminder = new Reminder(req.body);
  winston.info("reminder controller hit");
  //winston.info(reminder);
  reminder.save(function(err, reminder) {
    if(!err) {
      res.send(reminder);
    } else {
      res.status(500);
      res.send(err);
    }
  });
}

exports.receiveSMS = function (req, res) {
  winston.info('Inside receiveSMS');
  var resp = new smsresponse.TwimlResponse();
  resp.message('You replied: ' + req.body.Body);
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  winston.info("The client responded with: " + req.body.Body);
  winston.info(JSON.stringify(req.body));
  /*Reminder.findByIdAndUpdate(
    req.body.
  )*/
  res.end(resp.toString());
}
//fire a console log statement if we recieve a response


//User.populate(req.user, {path: 'clients'}, function(err, user) {

exports.read = function(req, res) {

}

//TODO change routes so this method gets called
exports.addResponse = function(req, res) {
  //winston.info(req.body);
  winston.info('add response triggerd');
  var reminder;

  Reminder.findByIdAndUpdate(
    req.params.id ,
    {
      $push: {
        "responses": {
          timeStamp: Date.now(),
          completed: true,
          text: req.body.text
        }
      }
    },
    {safe: true, upsert: true, new : true},
        function(err, model) {
          winston.info("reminder updated");
          winston.info(err);
          winston.info(model);
          reminder = model;
        }
      );
  User.findById(reminder.assignee ,
    function(err, user) {
      if(!err) {
        //edit the user
        winston.log("user was reached" + user);
        user.mostRecentResponse = "Worked";
        user.save;
      }
    }
  );


  res.send(model);
}

//from http://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose


exports.update = function(req, res) {
  winston.info('Updating reminder');
  winston.info();
  ////winston.info(req.body);
  Reminder.findOneAndUpdate({'_id': req.body._id},
  {
    title: req.body.title,
    timeOfDay: req.body.timeOfDay,
    days: req.body.days,
    hour: req.body.hour,
    minute: req.body.minute,
    seletedDates: req.body.selectedDates,
    daysOfTheWeek: req.body.daysOfTheWeek,
    author: req.body.author,
    assignee: req.body.assignee
  }, {new: true}, function (err, reminder) {
    if (!err) {
      winston.info('Reminder updated: ' + reminder);
      res.send(reminder);
    } else {
      res.status(500);
      res.send(err);
    }
  });
}

exports.delete = function(req, res) {
  winston.info();
  winston.info('Inside reminder.delete');
  winston.info('id: ' + req.params.id);
  Reminder.findByIdAndRemove(
    req.params.id,
    function(err, reminder) {
      if(reminder) {
        //winston.info(reminder);
        User.findByIdAndUpdate(reminder.assignee,
          {$pull : {reminders: {_id: reminder._id}}},
          {new: true},
          function(err, model) {
            winston.info();
            winston.info('Should output a user with the specified reminder removed.');
            //winston.info(model);
            res.sendStatus(200);
          if(err) {
            // Do some flash message
          }
        });
      }
      else{
        winston.info();
        winston.info(err);
        res.sendStatus(500);
      }
    }
  );
}

exports.listNow = function(req,res) {

   var now = new Date();
   var hoursNow = now.getHours();
   var minutesNow = now.getMinutes();
   var dayNow = now.getDay();

   Reminder.find({days: dayNow})
           .where('hour').equals(hoursNow)
           .where('minute').equals(minutesNow)
           .populate('assignee')
           .populate('slack')
           .exec(function(err, docs){
             winston.info(docs);
             winston.info('exec reminder/now');
             if(docs){
               res.json(docs);
             }
             else {
               winston.error(err);
             }
           });
}

exports.list = function(req, res) {
  Reminder.find({}, function(err, obj) {
    res.json(obj);
  })
}
