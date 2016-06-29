'use strict'

var mongoose = require('mongoose');
var User = require('../../models/user.js');
var request = require('request');
var async = require('async');
var crypto = require('crypto');
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require('nodemailer');
var config = require('../../config/env/development.js');

exports.webhook = function(req, res) {
  console.log(req.query);
  if (req.query['hub.verify_token'] === 'a_token') {
    res.send(req.query['hub.challenge']);
  }
}

exports.recieve = function(req, res) {
  console.log(req.body);
  var messaging_events = req.body.entry[0].messaging;
  console.log(messaging_events);
  for (var i = 0; i < messaging_events.length - 1; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
    }
  }
  res.sendStatus(200);
}

exports.send = function(req, res) {

}

exports.connectUser = function (req, res) {
  res.writeHead(302, {
    'Location': 'https://www.facebook.com/dialog/oauth?client_id=' + config.facebook.clientID + '&redirect_uri=http://107.170.21.178:12557/api/facebook/getclientprofile'
  });
  res.end();
}

exports.getClientProfile = function (req, res) {
  console.log('Getting client\'s profile from Facebook');
  console.log(req.query.code);
  request('https://graph.facebook.com/v2.6/oauth/access_token?client_id=' + config.facebook.clientID + '&redirect_uri=http://107.170.21.178:12557/api/facebook/getclientprofile&client_secret=' + config.facebook.clientSecret + '&code=' + req.query.code, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      console.log('Printing body');
      console.log(body);
      console.log();
      console.log(JSON.parse(body).access_token);
      request('https://graph.facebook.com/v2.6/me?access_token=' + JSON.parse(body).access_token, function (err, res, body) {
        console.log(err);
        //console.log(res);
        console.log(body);
        var _body = JSON.parse(body);
        request('https://graph.facebook.com/' + JSON.parse(body).id + '/picture/', function (err, res, body) {
          console.log(res.request.href);
          User.findOneAndUpdate({fullName: _body.name}, {imgUrl: res.request.href}, {new: true}, function (err, user) {
            if (!err) {
              console.log('User updated successfully');
              console.log(user);
            } else {
              console.log('Error');
              console.log(err);
            }
          })
        });
      });
    }
  });
  res.render('pages/thanks');
}

exports.sendEmail = function (req,res){
  console.log("Here");

  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ username: req.body.username }, function(err, user) {
        if (!user) {
          console.log('no user found');
          req.flash('status', 'No user with that email was found!');
          return res.send('502');
        }
        console.log("did  i get here!"  + user);
        //user.resetPasswordToken = token;
        //user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {

      var transporter = nodemailer.createTransport(
          smtpTransport({
            service: 'gmail',
            auth: {
              user: 'fitpathmailer@gmail.com',
              pass: 'fitpathmail'
            }
          })
      );
      console.log(user.email);
      var mailOptions = {
        to: user.email, //user.username,
        from: 'fitpathmailer@gmail.com',
        subject: 'Fitpath.me Profile Generator',
        text:
        'You are receiving this because your coach wants to have profile information on Fitpath.me dashboard to help him/her coach you better.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n'+
            'http://107.170.21.178:12557/api/facebook/connect/\n\n' +
          'Thank you for your time.\n'
      };

      transporter.sendMail(mailOptions, function(err,info) {
        if(err){
          return console.log("this is an "+ err);
        }
        console.log('Message sent: ' + info.response);

        req.flash('status', 'An e-mail has been dispatched!');
        done(err, 'done');
      });
    }
    ], function(err) {
      if (err) return next(err);
      //res.send(502);
    });
  res.send({});
}

exports.echo = function(req,res) {
  var token = "EAAOJsBYKnd8BAPT6ZCIcnqR3hFfk5rg8zS2laSfx6MLjU71xouZAE2ZBuZBHQZBgdoOW4sAJRRx8z0ZCQxvqKUXtGT6EH0ZCZCqSdOGNCs7AUxn1z80No85OfWo0nP73PoiTRjiRn66yN67XjHvRHrMKPF3DwIYjoq26UD1EUfTYCAZDZD";
  var messaging_events = req.body.entry[0].messaging;
  console.log(req.body.entry.length);



  // for (var i = 0; i < messaging_events.length; i++) {
  //   var event = req.body.entry[0].messaging[i];
  //   var sender = event.sender.id;
  //   if (event.message && event.message.text) {
  //     var text = event.message.text;
  //     sendTextMessage(sender,text);
  //   }
  // }




  function sendTextMessage(sender, text) {
    var messageData = {
      text:text
    }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData,
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  }
}

exports.getProfile = function (req, res) {
  console.log('User id: ' + req.params.user_id);
  console.log('Access token: ' + req.params.access_token);
  var options = {
    url: 'https://graph.facebook.com/' + req.params.user_id + '?access_token=' + req.params.access_token,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36'
    }
  };
  request(options, function (error, response, body) {
    if (!error) {
      console.log(body);
      var fullName = JSON.parse(body).name;
      console.log(fullName);
      var splitFullName = fullName.split(' ');
      var newOptions = {
        url: 'https://graph.facebook.com/' + req.params.user_id + '/picture/?access_token=' + req.params.access_token,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36'
        }
      }
      request(newOptions, function (error, response, body) {
          if (!error) {
            console.log(response.request.uri.href);
            console.log(body);
            var profilePic = response.request.uri.href;
            var user = {
              firstName: splitFullName[0],
              lastName: splitFullName[1],
              username: fullName,
              provider: 'facebook',
              role: 'user',
              slack_id: fullName,
              slack: {
                id: fullName,
                name: fullName,
                real_name: fullName,
                img: profilePic
              },
              imgUrl: profilePic,
              facebookId: req.params.user_id
            };
            res.send(user);
          }
      });
    }
  });
};
