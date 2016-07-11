'use strict'

var mongoose = require('mongoose');
var db = require('../../config/mongoose');
var Willow = require('../../models/willow');
var winston = require('winston');

exports.create = function(req, res) {
  //winston.info(req.body);
  new Willow({
    token: req.body.token,
    team_id: req.body.team_id,
    team_domain: req.body.team_domain,
    channel_id: req.body.channel_id,
    channel_name: req.body.channel_name,
    timestamp: req.body.timestamp,
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    text: req.body.text,
    trigger_word: req.body.trigger_word
  }).save( function(err, willow, count) {
    res.send(willow);
  })
}

exports.list = function(req, res) {

}
