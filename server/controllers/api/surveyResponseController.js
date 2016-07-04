'use strict';

var mongoose = require('mongoose');
var SurveyResponse = require('../../models/surveyResponse.js');

exports.create = function (req, res) {
  var surveyResponse = new SurveyResponse(req.body);

  surveyResponse.save(function (err, surveyResponse) {
    if (!err) {
      res.json(surveyResponse);
    } else {
      res.send(err);
    }
  })
};

exports.read = function (req, res) {
  SurveyResponse.findById(req.params.response_id, function (err, surveyResponse) {
    if (!err) {
      res.json(surveyResponse);
    } else {
      res.send(err);
    }
  });
};

exports.update = function(req, res) {
  SurveyResponse.findByIdAndUpdate(
    req.params.response_id,
    req.body,
    {new: true},
    function (err, surveyResponse) {
      if (!err) {
        res.json(surveyResponse);
      } else {
        res.send(err);
      }
  });
};

exports.delete = function (req, res) {
  SurveyResponse.findByIdAndRemove(req.params.response_id, function (err, surveyResponse) {
    if (!err) {
      res.json(surveyResponse);
    } else {
      res.send(err);
    }
  });
};

exports.listAll = function (req, res) {
  SurveyResponse.find(function (err, surveyResponses) {
    if (!err) {
      res.json(surveyResponses);
    } else {
      res.send(err);
    }
  })
};
