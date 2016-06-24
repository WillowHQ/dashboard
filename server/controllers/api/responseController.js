'use strict'

var mongoose = require('mongoose');
var Response = require('../../models/response.js');
var User = require('../../models/user.js');
var moment = require('moment');
var Reminder = require('../../models/reminder.js');


exports.create = function(req, res) {
  console.log("HERE HEREH");
  var response = new Response(req.body);

  response.save(function(err) {
    if(err){
      res.sendStatus(409);
    }
    // if(!err){
    //   console.log("No Error :)";
    //   Reminder.findByIdAndUpdate(
    //     response.reminder._id,
    //     {$push:{"responses": response}},
    //     {safe: true},
    //     function(err, reminder){
    //       if(err){
    //         console.log(err);
    //         res.sendStatus(400);
    //       }
    //       else {
    //         console.log(reponse pushed to reminder);
    //         res.sendStatus(200);
    //       }
    //     }
    //   );
    //
    // }
  });
  
  res.sendStatus(200);

}

exports.list = function(req, res) {
  // ReminderResponse.find({}, function(err, obj) {
  //   res.json(obj);
  // })
  console.log("HER DAD ");
  res.json({name: "josh"});
}
