'use strict'

var mongoose = require('mongoose');
var WillowSurvey = require('../../models/willow-survey.js');
var winston = require('winston');

exports.create = function(req, res) {
  //winston.info(req.body);
  var survey = new WillowSurvey(req.body);
  survey.save(function(err, survey) {
    if(!err) {
      res.send(survey);
    }
  });
}


exports.read = function(req, res) {

}

exports.update = function(req, res) {

}

exports.delete = function(req, res) {

}

exports.list = function(req, res) {
  WillowSurvey.find({}, function(err, obj) {
    res.json(obj);
  })
}
