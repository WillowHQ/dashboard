'use strict'

var mongooose = require('mongoose');
var Message = require('../../models/message.js');
var User = require('../../models/user.js');
var _ = require('underscore');
var moment = require('moment');
var Promise = require('bluebird');
var request = require('request');
var twilio = require('twilio')('ACf83693e222a7ade08080159c4871c9e3', '20b36bd42a33cd249e0079a6a1e8e0dd');
var twiml = require('twilio');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Http = require('http');
var bodyParser = require('body-parser');
var Bot = require('messenger-bot');

http.listen(3001, function() {
  console.log('listening for websocket connections on *:3001');
});

// a list of currently connected sockets
var sockets = [];

io.on('connection', function (socket) {
  console.log('A user connected');
  sockets.push(socket);
  socket.on('disconnect', function () {
    console.log('User disconnected');
    sockets = _.without(sockets, socket);
  });
});

let bot = new Bot({
  token: 'EAADXmpOGmZBQBAP1nUwAntcZAU8gO7Md7y1FWsy2TGJPKIB434MgCg7v22OiKBo9zZBxGwo0QiL1Nlz9zcWbmB7dsoFqZCt5DsQASqfNZBcynJv1aZCP8C96J7gyFNSu1E3VjqskMguW2ZBOTa9whpa4SQOjXZB7RaegrZAEASwwz7AZDZD',
  verify: 'supersecrettoken'
});

bot.on('error', function (err) {
  console.log(err.message);
});

bot.on('message', function (payload, reply) {
  let text = payload.message.text;

  var message = Message({
    body: text,
    sentTo: '',
    sentFrom: ''
  });
  bot.getProfile(payload.sender.id, function (err, profile) {
    if (err) throw err;
    console.log(JSON.stringify(profile));
    // Find user by first and last name
    User.findOne({ firstName: profile.first_name, lastName: profile.last_name}, function (err, user) {
        console.log(user._id);
        var message = Message({
          body: text,
          sentTo: '5740e30ee797009c369c2393',
          sentBy: user._id
        });
        User.findByIdAndUpdate(
          user._id,
          {$push: {"messages": message}},
          {safe: true},
          function (err, userToUpdate) {
            userToUpdate.facebookId = payload.sender.id;
            userToUpdate.save();
            console.log(JSON.stringify(userToUpdate));
            io.emit('message', message);
          }
        );
    });
    /*reply({ text }, function (err) {
      if (err) throw err;
    });*/
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  return bot._verify(req, res);
});

app.post('/', function (req, res) {
  bot._handleMessage(req.body);
  res.end(JSON.stringify({status: 'ok'}));
});

Http.createServer(app).listen(3003);
console.log('Listening for Facebook messages on *:3003');

/*// sockets a list of currently connected sockets
var sockets = [];

io.on('connection', function (socket) {
  console.log('A user connected');
  sockets.push(socket)
  socket.on('disconnect', function () {
    console.log('User disconnected');
    sockets = _.without(sockets, socket);
  });
});*/

exports.sendFB = function (req, res) {
  var message = new Message(req.body);
  console.log('Begin sendSMS');

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

exports.sendSMS = function (req, res) {
  var message = new Message(req.body);
  console.log('Begin sendSMS');

  message.save(function(err, message) {
    if (!err) {
      console.log("Message saved.");
      console.log('Message is: ' + JSON.stringify(message));
      User.findByIdAndUpdate(
        message.sentTo,
        {$push: {"messages": message}},
        {safe: true},
        function(err, user) {
          if (err) {
            console.log("ERROR!!!!!!");
            console.log(err);
          } else {
            console.log('Message pushed to user');
            console.log('User is ' + JSON.stringify(user));
            var sentToPhoneNumber = '';
            User.findById(message.sentTo, function (err, userSentTo) {
              if (!err) {
                twilio.sendMessage({
                  to: userSentTo.phoneNumber,
                  from: '+12898062194',
                  body: message.body
                }, function (err, responseData) {
                  if (!err) {
                    console.log(JSON.stringify(responseData));
                    //`console.log('Message successfully sent to: ' + userSentTo.phoneNumber);
                  }
                });
              }
            });
          }
        }
      )
      console.log(message);
      res.send(message);
    }
  });
}

exports.receiveSMS = function (req, res) {
  console.log('Begin receiveSMS');
  var resp = new twiml.TwimlResponse();
  console.log('Received SMS from: ' + req.body.From);
  //resp.message('You wrote: ' + req.body.Body);
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  console.log("The client wrote: " + req.body.Body);
  console.log('req.body.From is: ' + req.body.From);
  // Find user by phone num and actually create valid message object
  User.findOne({phoneNumber: req.body.From}, function (err, user) {
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
          console.log('The user with that phone number is: ' + user.slack.name);
          io.emit('message', message);
          console.log('Message saved and pushed to user');
        }
      });
  });
  /*User.findByPhoneNumber(req.body.From, function (err, user) {
    if (!err) {
      console.log("The user with that phone number is: " + user.slack.name);
      message.save(function (err, message) {
        console.log('Message saved');
        if (!err) {
          User.findByIdAndUpdate(
            message.sentBy,
            {$push: {"messages": message}},
            {safe: true},
            function (err, user) {
              if (err) {
                console.log(err);
              } else {
                console.log('Message saved and pushed to user, at least theoretically.');
              }
            }
          )
        }
      });
    }
  });*/
  //console.log(JSON.stringify(req.body));
  res.end(resp.toString());
}
/*
exports.sendFB = function (req, res) {
  /*if (req.method === 'GET') {
    if (req.query['hub.verify_token'] === '4kfz2v98hj1CCG2ho01C1s1Pup5TEh2JuBOVXDnh') {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');
    }
  } else {
    console.log(req.method);
    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
      event = req.body.enty[0].messaging[i];
      var sender = event.sender.id;
      if (event.message && event.message.text) {
        var text = event.message.text;
        // Handle a text message from this sender
        console.log('The user wrote: ' + text);
      }
    }
    res.sendStatus(200);
  //}
}
*/
