var mongoose = require('mongoose');
var SurveyTemplate = require('../../models/surveyTemplate.js');
var User = require('../../models/user.js');
var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request');
var fs = require('fs')

exports.create = function(req, res) {
  var surveyTemplate = new SurveyTemplate(req.body);
  //SurveyTempalte.
  console.log(surveyTemplate);
  surveyTemplate.save(function (err) {
    if(!err) {
      console.log("NO Error")
      User.findByIdAndUpdate(
          surveyTemplate.author,
          {$push: {"surveyTemplates": surveyTemplate}},
          {safe: true},
          function(err, user) {
            if(err) {
              console.log(err);
            }
            else {
              console.log("SurveyTemple pushed to coach.");

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
