'use strict'

var mongooose = require('mongoose');
var Message = require('../../models/message.js');
var User = require('../../models/user.js');
var Reminder = require('../../models/reminder.js');
var _ = require('underscore');
var moment = require('moment');
var Promise = require('bluebird');
var request = require('request');
var twilio = require('twilio')('ACf83693e222a7ade08080159c4871c9e3', '20b36bd42a33cd249e0079a6a1e8e0dd');
var twiml = require('twilio');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(45874);
var bodyParser = require('body-parser');
//var Bot = require('messenger-bot');
var config = require('../../config/env/development.js');
var winston = require('winston');

//http.listen(3853, function () {
  winston.info('listening for websocket connections on *:45874');
//});

// a list of currently connected sockets
var sockets = [];

io.on('connection', function (socket) {
  winston.info('A user connected');
  sockets.push(socket);
  socket.on('disconnect', function () {
    winston.info('User disconnected');
    sockets = _.without(sockets, socket);
  });
});


/*exports.sendFB = function (req, res) {
  var message = new Message(req.body);
  console.log('Begin sendFB');

  message.save(function(err, message) {
    if (!err) {
      User.findByIdAndUpdate(
        message.sentTo,
        {$push: {"messages": message}},
        {safe: true},
        function (err, user) {
          if (err) {
            console.log(err);
          } else {
            console.log('User\'s fb is is: ' + user.facebookId);
            console.log('message.body is: ' + message.body);
            bot.sendMessage(user.facebookId, {text: message.body}, function (err, info) {
              console.log(JSON.stringify(info));
            });
          }
        }
      )
      res.send(message);
    }
  });
};
*/
exports.sendSMS = function (req, res) {
  var message = new Message(req.body);
  winston.info('Begin sendSMS');

  message.save(function(err, message) {
    if (!err) {
      winston.info("Message saved.");
      winston.info('Message is: ' + JSON.stringify(message));
      User.findByIdAndUpdate(
        message.sentTo,
        {$push: {"messages": message}},
        {safe: true},
        function(err, user) {
          if (err) {
            winston.info("ERROR!!!!!!");
            winston.info(err);
          } else {
            winston.info('Message pushed to user');
            winston.info('User is ' + JSON.stringify(user));
            var sentToPhoneNumber = '';
            User.findById(message.sentTo, function (err, userSentTo) {
              if (!err) {
                twilio.sendMessage({
                  to: userSentTo.phoneNumber,
                  from: config.phoneNumbers.messages,
                  body: message.body
                }, function (err, responseData) {
                  if (!err) {
                    winston.info(JSON.stringify(responseData));
                    //`console.log('Message successfully sent to: ' + userSentTo.phoneNumber);
                  }
                });
              }
            });
          }
        }
      )
      winston.info(message);
      res.send(message);
    }
  });
}

exports.receiveSMS = function (req, res) {
  winston.info('Begin receiveSMS');
  var resp = new twiml.TwimlResponse();
  winston.info('Received SMS from: ' + req.body.From);
  //resp.message('You wrote: ' + req.body.Body);
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  winston.info("The client wrote: " + req.body.Body);
  winston.info('req.body.From is: ' + req.body.From);
  // Find user by phone num and actually create valid message object
  User.findOne({phoneNumber: req.body.From}, function (err, user) {
    winston.info('User is: ' + JSON.stringify(user));
    winston.info('We should be adding a message');
    var message = new Message({
      body: req.body.Body,
      sentBy: user._id,
      sentTo: '5741ef7c5254295828d8c3b0'
    });
    User.findOneAndUpdate(
      {phoneNumber: req.body.From},
      {$push: {messages: message}},
      {safe: true},
      function (err, user) {
        if (!err) {
          winston.info('The user with that phone number is: ' + user.slack.name);
          io.emit('message', message);
          winston.info('Message saved and pushed to user');
        }
      });
    });
    res.end(resp.toString());
}
