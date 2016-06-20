'use strict'

var mongoose = require('mongoose');
var User = require('../models/user.js');
var SurveyTemplate = require('../models/surveyTemplate.js');
var async = require('async');
var crypto = require('crypto');
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require('nodemailer');
var dashboard = require('./dashboard.controller');
var parse = require('csv-parse');
var _ = require('underscore');
var Pandorabot = require('pb-node');
var builder = require('xmlbuilder');
var fs = require('fs');

var botOptions = {
  url: 'https://aiaas.pandorabots.com',
  app_id: '1409612709792',
  user_key: '83a7e3b5fa60385bd676a05cb4951e98',
  botname: 'willow'
};

var bot = new Pandorabot(botOptions);

/**
  Node Mailer Config
*/

exports.createBio = function(req, res){
  console.log(req.body.body);

  User.findByIdAndUpdate(req.params.id,
  {$set: {"bio": req.body.body}},
  {safe: true},
  function(err, user) {
   if(err) {
     console.log(err);
    }
  });

  res.send(req.body.body);
}
exports.createPipelineStage = function(req,res){
  console.log("Im here");

  // User.findByIdAndUpdate(req.params.id,
  // {$set: {"pipelineStage": req.body.body}},
  // {safe: true},
  // function(err, user) {
  //  if(err) {
  //    console.log(err);
  //   }
  // });
  //
  // res.send(req.body.body);
  //
  res.send({});
};

exports.createPhoneNumber = function (req, res) {
  User.findByIdAndUpdate(req.params.id,
  {$set: {"phoneNumber": req.body.number}},
  {safe: true},
  function (err, user) {
    if (err) {
      console.log(err);
    }
  });
  res.send(req.body.number);
};

exports.create = function(req, res) {
  console.log("Im before new User.");
  console.log(req.body);
  var user = new User(req.body);
  user.provider = 'local';
  user.fullName = user.firstName + ' ' + user.lastName;
  user.pandoraBotSaid = '';
  user.save(function(err) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      console.log(user._id);

      console.log("User controller hit");
      console.log(user._id);

      // Generate all current surveys for this user
      SurveyTemplate.find({}, function (err, surveys) {
        _.each(surveys, function (survey) {
          var xml = builder.create('aiml').att('version', '2.0');
          xml.ele('category')
            .ele('pattern', 'XINIT ' + survey._id + user._id)
            .up()
            .ele('template', 'Hi! Here\'s a survey your coach wanted me to send you.\n' + survey.questions[0].question);
          //Find out how the bot normalizes the first question
          var normalizedQuestion;
          bot.talk({extra: true, trace: true, input: 'XNORM ' + survey.questions[0].question}, function (err, res) {
            normalizedQuestion = res.responses.join(' ');

            User.findByIdAndUpdate(
              user._id,
              {pandoraBotSaid: normalizedQuestion},
              {new: true},
              function (err, user) {
                console.log('User updated');
                console.log(user);
            });

            //TODO: fix if IE support becomes an issue
            var total = survey.questions.length - 1;
            var count = 0;
            var xmlString = '';
            for (var key = 0; key < survey.questions.length; key++) {
              (function (question) {
                if (key != 0) {
                  bot.talk({extra: true, trace: true, input: 'XNORM ' + question}, function (err, res) {
                    if (!err) {
                      xml.ele('category')
                        .ele('pattern', user._id + ' *')
                        .up()
                        .ele('that', normalizedQuestion)
                        .up()
                        .ele('template', question)
                          .ele('think')
                            .ele('set')
                              .att('name', survey._id + user._id + count)
                              .ele('star');
                      normalizedQuestion = res.responses.join(' ');
                    }
                    count++;
                    if (count > total - 1) {
                      (function () {
                        xml.ele('category')
                          .ele('pattern', user._id + ' *')
                          .up()
                          .ele('that', normalizedQuestion)
                          .up()
                          // Bot signals end of conversation by sending id of survey and user id
                          .ele('template', 'Thanks for answering my questions! Enjoy the rest of your day. ' + survey._id + user._id)
                            .ele('think')
                              .ele('set')
                                .att('name', survey._id + user._id + count)
                                .ele('star');
                        xmlString = xml.end({pretty: true});
                        console.log();
                        console.log(xmlString);
                        fs.writeFile('botfiles/' + survey._id + user._id + '.aiml', xmlString, function (err) {
                          if (err) {
                            console.log(err);
                          }
                          console.log('The file was saved.');
                          bot.upload('botfiles/' + survey._id + user._id + '.aiml', function (err, res) {
                            if (!err) {
                              console.log(res);
                              bot.compile(function (err, res) {
                                if (!err) {
                                  console.log('Bot ready to use.');
                                  console.log(res);
                                }
                              });
                            }
                          });
                        });
                      }());
                    }
                  });
                }
              })(survey.questions[key].question);
            }
          });
        });
      });

      User.findByIdAndUpdate(user.coaches[0],
        {$push: {"clients": user._id}},
        {safe: true},
        function(err, coach) {
          if(err) {
            console.log(err);
          }
          else {
            console.log('adding user ' + user._id + ' ot coac');
            user.clients.push(user._id);
            console.log(coach);
            console.log('success');
            res.send(user);
          }
        });
      }
    });
  };

  //Test: need my our id(colins)
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

exports.updateCoach = function(req, res){
  console.log("Im a coach!");
  var user = new User(req.body);
  /*
  User.findByIdAndUpdate(

  );
  */
  console.log('ima a saf');
  res.send(user);
}


exports.render = function(req, res) {

  if (!req.user) {
		// Use the 'response' object to render the signup page
		res.render('pages/signin', {
			// Set the page title variable
			title: 'Sign-up Form',
			// Set the flash message variable
			messages: req.flash('You must be logged In!')
		});
	} else {
		res.render('pages/profile', {
      user: req.user,
      userFullName: req.user ? req.user.fullName : '',
      email: req.user ? req.user.username : '',
      messages: req.flash('success')
    });
	}
}


exports.forgot = function(req, res) {
  res.render('pages/reset', {
    message: req.flash('status')
  });
}

exports.reset = function(req,res,next) {
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
          return res.redirect('/forgot');
        }
        console.log(user);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

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

      var mailOptions = {
        to: user.username, //user.username,
        from: 'fitpathmailer@gmail.com',
        subject: 'Fitpath.me Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      transporter.sendMail(mailOptions, function(err,info) {
        if(err){
          return console.log(err);
        }
        console.log('Message sent: ' + info.response);

        req.flash('status', 'An e-mail has been dispatched!');
        done(err, 'done');
      });

    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
}

exports.token = function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
  function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('pages/edit-password', {
      user: user,
      message: req.flash('success', 'Enter in your new password!')
    });
  });
}

exports.change = function(req, res) {
  async.waterfall([
     function(done) {
       User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
         if (!user) {
           req.flash('error', 'Password reset token is invalid or has expired.');
           return res.redirect('back');
         }
         user.password = req.body.confirm;
         user.resetPasswordToken = undefined;
         user.resetPasswordExpires = undefined;

         user.save(function(err) {
           req.logIn(user, function(err) {
             done(err, user);
           });
         });
       });
     },
   ], function(err) {
     res.redirect('/');
   });
}


exports.update = function(req,res) {
  console.log(req.body);
  if(!req.user) {
    // Use the 'response' object to render the signup page
    res.render('pages/signin', {
      // Set the page title variable
      title: 'Sign-up Form',
      // Set the flash message variable
      messages: req.flash('You must be logged In!')
    });
  } else {
  /*   User.findByIdAndUpdate({

*/
    //});

    res.redirect('/');
  }
}


exports.delete = function(req, res){
  console.log("hey");
  console.log(req.body);
  
  res.send("403");


}

exports.parseCSV = function (req, res) {
  console.log(req.body.textToParse);
  parse(req.body.textToParse, function (err, output) {
    console.log(JSON.stringify(output));
    res.send(output);
  });
};
