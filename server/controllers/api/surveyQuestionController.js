'use strict';

var mongoose = require('mongoose');
var SurveyQuestion = require('../../models/surveyQuestion.js');

exports.create = function (req, res) {
  var surveyQuestion = new SurveyQuestion(req.body);

  surveyQuestion.save(function (err, surveyQuestion) {
    if (!err) {
      res.json(surveyQuestion);
    } else {
      res.send(err);
    }
  })
};

exports.read = function (req, res) {
  SurveyQuestion.findById(req.params.question_id, function (err, surveyQuestion) {
    if (!err) {
      res.json(surveyQuestion);
    } else {
      res.send(err);
    }
  });
};

exports.update = function(req, res) {
  SurveyQuestion.findByIdAndUpdate(
    req.params.question_id,
    req.body,
    {new: true},
    function (err, surveyQuestion) {
      if (!err) {
        res.json(surveyQuestion);
      } else {
        res.send(err);
      }
  });
};

exports.delete = function (req, res) {
  SurveyQuestion.findByIdAndRemove(req.params.question_id, function (err, surveyQuestion) {
    if (!err) {
      res.json(surveyQuestion);
    } else {
      res.send(err);
    }
  });
};

exports.listAll = function (req, res) {
  SurveyQuestion.find(function (err, surveyQuestion) {
    if (!err) {
      res.json(surveyQuestion);
    } else {
      res.send(err);
    }
  })
};
