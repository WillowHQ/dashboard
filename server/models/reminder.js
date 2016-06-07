'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user.js');
var moment = require('moment');
var ReminderResponse = require('./reminderResponse.js');
var hooker = require('hooker');

var reminderSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String},
  start: {type: Date, default: Date.now},
  timeOfDay: {
    type: Date, default: Date.now
      // validate:{
      //   validator: function(v) {
      //     return formatTime(v);
      //
      //   },
      //   message: '{value} is not a valid time'
      // },
      // required: [true, 'you gotta tell us when to remind you !']
    },
  selectedDates: [String],
  daysOfTheWeek: {
    monday: {type: Boolean},
    tuesday: {type: Boolean},
    wednesday: {type: Boolean},
    thursday: {type: Boolean},
    friday: {type: Boolean},
    saturday: {type: Boolean},
    sunday: {type: Boolean}
  },

  responses : [
    {
      response: {type: String},
      createdBy: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
    }
  ],
   // Who the reminder is coming from
  days: [{type: Number, min: 0, max: 6}],
  hour: {type: Number, min: 0, max: 23},
  minute: {type: Number, min:0, max:59},
  // Owner of the object, which models
  parent: {
    id: {type: String},
    model: {type: String}
  },
  // Which Messaging service will the reminder use
  delivery: {
    id: {type: String},
    platform: {
      type: String,
      enum: ['facebook', 'slack', 'text']
    }
  },
  // Who the reminder is going too
  assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  // Who the reminder is coming from
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

  needsResponse: {type: Boolean, default: false}
});

reminderSchema.virtual('mostRecentResponse').get(function() {
	return this.responses[this.responses.length - 1];
});

reminderSchema.statics.makeDefaultReminder = function () {
    var reminder = new Reminder();
    reminder.save(function (err) {
        if (err) return err;
    })
    return reminder;

};
reminderSchema.method.response = function(){
  console.log('can I get a hello');
  return 'hello';
};

/*
*  Decides if based on the date and contents on the response if we want
*  to increment their status point
*  Returns Boolean Value
*/
/*reminderSchema.methods.increment = function() {

  var currentResponse = this.responses[this.responses.length - 1];
  var lastResponse = this.lastGenuine();
  var lastNonResponse = this.lastNonResponse();

  // Genuine response
  if(currentResponse.responded === true) {

    var currentDate = moment(currentResponse.timeStamp);
    var lastResponseDate = moment(lastResponseDate.timeStamp);

    // If the last genuine response happend atleast a day ago
    if(currentDate.subtract(1, 'days').isSameOrBefore(lastResponseDate))
      return true;
    // Else, last genuine response happend on the same day, thus do not increment
    else
      return false;
  }
  // Blank response
  else{
    return false;
  }

}
*/
// We want to decrement if the last response
reminderSchema.methods.decrement = function() {

  var currentResponse = this.responses[this.responses.length - 1];
  var lastNonResponse = this.lastNonResponse();

  if(currentResponse.responded === false) {
    var currentDate = moment(currentResponse.timStamp);
    var lastNonResponseDate = moment(lastNonResponse.timeStamp);

    if(currentDate.subtract(1, 'days').isSameOrBefore(lastNonResponseDate))
      return true;
    else
      return false;
  }
  else{
    return false;
  }

}

reminderSchema.methods.lastGenuine = function() {
  for(var i = this.responses.length - 1; i >= 0; i--) {
    if(this.responses[i].responded) {
      return this.responses[i].timeStamp;
    }
  }
}

reminderSchema.methods.lastNonResponse = function() {
  for(var i = this.responses.length - 1; i >= 0; i--) {
    if(!this.responses[i].responded) {
      return this.responses[i].timeStamp;
    }
  }
}

reminderSchema.post('findOneAndUpdate', function(doc) {
  console.log('reminde updated');
  console.log(doc);

});

reminderSchema.methods.parseDates = function() {

  this.days = [];
  if(this.daysOfTheWeek.sunday){
      this.days.splice(this.days.length,0,0);
  };
  if(this.daysOfTheWeek.monday){
      this.days.splice(this.days.length,0,1);
  };
  if(this.daysOfTheWeek.tuesday){
      this.days.splice(this.days.length,0,2);
  };
  if(this.daysOfTheWeek.wednesday){
      this.days.splice(this.days.length,0,3);
  };
  if(this.daysOfTheWeek.thursday){
      this.days.splice(this.days.length,0,4);
  };
  if(this.daysOfTheWeek.friday){
      this.days.splice(this.days.length,0,5);
  };
  if(this.daysOfTheWeek.saturday){
      this.days.splice(this.days.length,0,6);
  };

  this.hour = this.timeOfDay.getHours();
  this.minute = this.timeOfDay.getMinutes();

}

/*reminderSchema.pre('save', function(next) {
    this.parseDates();
    next();
});*/

//make a virtual that returns the most recent response on the responses array



var Reminder = mongoose.model('Reminder', reminderSchema);

hooker.hook(Reminder, 'update', {
  pre: function () {
    this.parseDates();
  },
  post: function () {

  }
});

//lets make making reminders a piece of cake !

//create a static method to make a default reminders object









// console.log(formatTime(" 1:00"));
// console.log(formatTime("1:00 "));
// console.log(formatTime("1:00"));
// console.log(formatTime("2100"));
// console.log(formatTime("90:00"));

module.exports = Reminder;
