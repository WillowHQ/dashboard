'use strict';

var User = require('../models/user.js');
var SurveyTemplate = require('../models/surveyTemplate.js');
var async = require('async');
var crypto = require('crypto');
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require('nodemailer');
var dashboard = require('./dashboard.controller');
var parse = require('csv-parse');
var _ = require('underscore');
var winston = require('winston');

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



exports.bySalckId = function (req, res) {
  console.log(req.params.id);
  console.log("slack ID");
  User.findOne({slack_id: req.params.id}, function(err, obj){
    if(err){
      console.log("crap");
      console.log(err);
    }
    else {
      console.log(obj);
      res.json(obj);
    }
  });
}


exports.updateMedium = function(req, res){
  console.log(req.body.text);

  User.findByIdAndUpdate(req.params.id,
  {$set: {"defaultCommsMedium": req.body.text}},
  {safe: true},
  function(err, user) {
   if(err) {
     console.log(err);
   } else {console.log("worked");}
  });

  res.send(req.body.text);
}
exports.updateSlackId = function(req, res){
  console.log(req.body);

  User.findByIdAndUpdate(req.params.id,
  {$set: {"slack_id": req.body.text}},
  {safe: true},
  function(err, user) {
   if(err) {
     console.log(err);
    }
  });

  res.send(req.body.text);
};



exports.createPipelineStage = function(req,res){
  console.log("Im here");

  User.findByIdAndUpdate(req.params.id,
  {$set: {"pipelineStage": req.body.body}},
  {safe: true},
  function(err, user) {
   if(err) {
     winston.error(err);
    }
  });

  res.send(req.body.body);

};

exports.createPhoneNumber = function (req, res) {
  User.findByIdAndUpdate(req.params.id,
  {$set: {"phoneNumber": req.body.number}},
  {safe: true},
  function (err, user) {
    if (err) {
      //console.log(err);
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
        console.log("Am i in here");
        res.status(500).send({ success: false, message: 'User already exist!' });
      }
      res.status(500).send(err);
    }
    else{
      console.log("good");
      res.send(req.body.number);
    }
  });

};

exports.addSurvey = function(req, res){
  console.log(req.body._id);
  User.findByIdAndUpdate(req.params.id,
  {$push:{"surveyTemplates": req.body._id}},
  {safe:true},
  function(err, user){
    if(err){
      console.log(err);
    }
  });
  res.send(req.body);
};

exports.create = function (req, res) {
  console.log("new user");
  var user = new User(req.body);
  user.provider = 'local';
  user.fullName = user.firstName + ' ' + user.lastName;
  user.pandoraBotSaid = '';

  user.save(function(err, user){
    if(err){
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
        console.log("Am i in here");
        console.log(err);
        res.status(500).send({ success: false, message: "Phone number already in use." });
      }
      else{
        console.log(err);
      }
    }
    else{
      console.log("Good");
      res.send(user);
    }
  })


}
exports.updateCoach = function(req, res){
  console.log("Im a coach!");
  console.log(req.params.id);
  var user = new User(req.body);
  console.log('ima a saf');

  User.findByIdAndUpdate({_id: req.params.id},
    {$push: {"clients": user._id}},
    {safe: true},
    function(err, coach) {
      if(err) {
        console.log(err);
      }
      else {
        console.log('adding user ' + user._id + ' ot coac');
        user.clients.push(user._id);
        console.log('success');
        res.send(user);
      }
    });


};











exports.create2 = function(req, res) {
  console.log("Im before new User.");
  //console.log(req.body);
  var user = new User(req.body);
  user.provider = 'local';
  user.fullName = user.firstName + ' ' + user.lastName;
  user.pandoraBotSaid = '';
  user.save(function(err) {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
        console.log("Am i in here");
        res.status(500).send({ success: false, message: 'User already exist!' });
      }
      else{
        console.log(err);
      }
    }
    else {
      console.log(user._id);

      console.log("User controller hit");
      console.log(user._id);

        User.findByIdAndUpdate(user.coaches[0],
        {$push: {"clients": user._id}},
        {safe: true},
        function(err, coach) {
          if(err) {
            winston.error(err);
          }
          else {
            console.log('adding user ' + user._id + ' ot coac');
            user.clients.push(user._id);
            console.log('success');
            res.send(user);
          }
        });
      }
    });
  };




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
          winston.error('no user found');
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
          return winston.error(err);
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
  //console.log(req.body);
  if(!req.user) {
    // Use the 'response' object to render the signup page
    res.render('pages/signin', {
      // Set the page title variable
      title: 'Sign-up Form',
      // Set the flash message variable
      messages: req.flash('You must be logged In!')
    });
  } else {

    res.redirect('/');
  }
};

exports.delete = function(req, res){
  console.log("hey");
  //console.log(req.body);

  res.send("403");
};

exports.getUser = function(req,res){
  console.log("getUser");
  console.log(req.params.id);
  User.findOne({_id: req.params.id}, function(err, obj){
    if(err){
      console.log("crap");
    }
    else {
      console.log(obj);
      res.json(obj);
    }
  });
}

exports.parseCSV = function (req, res) {
  console.log(req.body.textToParse);
  parse(req.body.textToParse, function (err, output) {
    console.log(JSON.stringify(output));
    res.send(output);
  });
};
