var mongoose = require('mongoose');
var SurveyTemplate = require('../../models/surveyTemplate.js');
var User = require('../../models/user.js');
var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request');
var fs = require('fs')
var twilio = require('twilio')('ACf83693e222a7ade08080159c4871c9e3', '20b36bd42a33cd249e0079a6a1e8e0dd');
var twiml = require('twilio');
var config = require('../../config/env/development.js');


var builder = require('xmlbuilder');
var fs = require('fs');





exports.create = function(req, res) {
  var surveyTemplate = new SurveyTemplate(req.body);
  surveyTemplate.save(function(err, surveyTemplate) {
    if(!err) {
      console.log("this worked");
          User.findByIdAndUpdate(
            surveyTemplate.author,
            // $addToSet works like $push but prevents duplicates
            {$addToSet: {"surveyTemplates": surveyTemplate}},
            {safe: true, new: true},
            function(err, user) {
              if(err) {
                console.log(err);
              }
              else {
                console.log(surveyTemplate);
                console.log('Printing user...');
                console.log(user);
              }
            }
          );
    } else {
      console.log(err);
    }
  });


  console.log();
  console.log('SURVEY CREATED aJJJJJJJJJJJJJ');
  console.log();
  res.send(surveyTemplate);
}

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

        console.log(surveyTemplate._id);
        res.send(surveyTemplate);

    }
  });
}



























exports.getSurveyTemplates = function(req,res){



}
