
// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
  	crypto = require('crypto'),
  	Schema = mongoose.Schema,
    Slack = require('./slack.js'),

    reminder = require('./reminder.js'),
    note = require('./note.js'),
    message = require('./message.js'),
    reminderResponse = require('./reminderResponse.js'),
    surveySchema = require('./survey.js').surveySchema;


// Define a new 'UserSchema'
var UserSchema = new Schema({
	firstName: String,
	lastName: String,
  fullName: String,
  bio: String,
	// email: {
	// 	type: String,
	// 	// Validate the email format
  //   index: true,
  //   unique: true,
	// 	match: [/.+\@.+\..+/, "Please fill a valid email address"]
	// },
  // Username is the unique itendifier,
	username: {
		type: String
		// Set a unique 'username' index
		//unique: true,
    //index: true
		// Validate 'username' value existance
		//required: 'Email is required',
		// Trim the 'username' field
    //match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	password: {
		type: String,
		// Validate the 'password' value length
    //minlength: [5, 'Password too short']
	},
  slack_id : {type: String},
  slack : {
    email: {type: String},
    id: {type: String},
    img: {type: String},
    name: {type: String},
    real_name: {type: String},
    team: {type: String},
    timezone: {type: String}
  },
  reminders: [
    {type: mongoose.Schema.Types.Object, ref: 'Reminder'}
  ],
  surveys: [
    surveySchema
  ],

  mostRecentReminder: {type: mongoose.Schema.Types.Object, ref: 'Reminder'},

  imgUrl: {
    type: String,
  },
  role:{
    type: String,
    enum: ['coach', 'user', 'admin'],
    default: 'coach'
  },
  defaultCommsMedium:{
    type: String,
    enum: ['sms', 'fb', 'slack'],
    default: 'sms'
  },
  //look at this an actual comment :) was going to override the user role but I think I'll make a new field so I don't break anything.
  pipelineStage:{
    type: String,
    enum: ['lead', 'prospect', 'trial', 'active-client', 'previous-client', 'archived', 'NA'],
    /** lead is a potential coach or client that we have contact information for but haven't spoken to yet
      propect is someone that we have established contact with
      trial is someone that is being offered a free service for a fixed period of timezone
      active-client is a person that is currently paying for training
      previous-client is someone that has paid for training ON fitpath
      archived is someone that we have moved out of the pipeline for some resetPasswordToken
      NA means they aren't part of a sales pipeline AKA a coach or a admin - or possibly a free "user"
      **/
      default: 'NA'
  },
  status: {
    value: {
      type: Number,
      min: 0,
      max: 7,
      default: 4
    },
    updated: {type: Date}
  },

  notes: [
    {type: mongoose.Schema.Types.Object, ref: 'Note'}
  ],
  messages: [
    {type: mongoose.Schema.Types.Object, ref: 'Message'}
  ],
    // reminder: {type: mongoose.Schema.Types.ObjectId, ref: 'Reminder'},
    // survey: {type: mongoose.Schema.Types.ObjectId, ref: 'Survey'}

  mostRecentResponse: {type: mongoose.Schema.Types.ObjectId, ref: 'ReminderResponse'},
  responses: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'ReminderResponse'
  }],
  coaches: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  clients: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
	salt: {
		type: String
	},
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
	provider: {
		type: String,
		// Validate 'provider' value existance
		required: 'Provider is required'
	},
  messenger: {
    type: String,
    enum: ['slack', 'facebook', 'text']
  },
	providerId: String,
	providerData: {},
	created: {
		type: Date,
		// Create a default 'created' value
		default: Date.now
	},
  phoneNumber: {type: String, unique: true},
  facebookId: Number,
  email: String,
  pandoraSessionId: String,
  // This is a hack for Pandorabots
  pandoraBotSaid: String,
  betaCode: String
});

UserSchema.plugin(uniqueValidator);

// Set the 'fullname' virtual property
// UserSchema.virtual('fullName').get(function() {
//   if(this.firstName && this.lastName){
//   return this.firstName + ' ' + this.lastName;
// } else return this.name;
// }).set(function(fullName) {
// 	var splitName = fullName.split(' ');
// 	this.firstName = splitName[0] || '';
// 	this.lastName = splitName[1] || '';
// });

// Use a pre-save middleware to hash the password
UserSchema.pre('save', function(next) {
	if (this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
  else {
    this.password = this.generatePassword();
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  this.messenger = this.messagingService();
  // Removed because will throw error if user is not coming from slack
	next();
});

UserSchema.methods.getStatus = function(){
  console.log("is this thing getting called");
  return status.value;


}

// Create an instance method for hashing a password
UserSchema.methods.hashPassword = function(password) {
  console.log();
  console.log('Hashing password, salt:');
  console.log(this.salt);
  console.log();
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

// Create an instance method for authenticating user
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

UserSchema.methods.generatePassword = function () {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

UserSchema.methods.messagingService = function() {
  if(this.provider == 'slack') {
    return 'slack';
  }
  if(this.provider == 'facebook') {
    return 'facebook';
  }
  else
    return 'text';
}

UserSchema.methods.isUnique = function (email) {
  this.findOne({
    username: email
  }, function(err, user) {
    if(!user) {
      return true;
    }
    else {
      return false;
    }
  })
}

UserSchema.methods.calcStatus = function() {



}

// If we need this later
UserSchema.statics.findByPhoneNumber = function (phoneNumber, callback) {
  console.log("Inside findByPhoneNumber, attempting to find: " + phoneNumber);
  return this.findOne({ 'phoneNumber': phoneNumber }, callback);
}

/*// Used to find the mostRecentSurvey and store it in the user object
UserSchema.method.findMostRecentSurvey = function () {
  // Surveys are stored in the coach, so retrieve the user's coach
  User.findById(this.coaches[0], function (err, coach) {
    if (!err) {
      // Surveys are pushed onto the array from the end, so the most recent is at the end of the array
      var length = coach.surveyTemplates.length;
      var mostRecentSurvey = coach.surveyTemplates[length - 1];
      this.mostRecentSurvey = mostRecentSurvey;
      // Persists the mostRecentSurvey to the db
      this.save();
      return mostRecentSurvey;
    } else {
      console.log('An error occurred:');
      console.log(err);
    }
  });
}
*/
// Used to find mostRecentReminder and store it in the user object
UserSchema.methods.findMostRecentReminder = function () {
  // Reminders are stored in the user
  var reminders = this.reminders;
  // Reminders are pushed onto the array from the end, so the most recent is at the end of the array
  var length =  reminders.length;
  var mostRecentReminder = reminders[length - 1];
  this.mostRecentReminder = mostRecentReminder;
  // Persists the mostRecentReminder to the db
  this.save();
  return mostRecentReminder;
}

// Used to find the mostRecentReminder and store it in the user object

// Find possible not used username
// UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
// 	var _this = this;
//
// 	// Add a 'username' suffix
// 	var possibleUsername = username + (suffix || '');
//
// 	// Use the 'User' model 'findOne' method to find an available unique username
// 	_this.findOne({
// 		username: possibleUsername
// 	}, function(err, user) {
// 		// If an error occurs call the callback with a null value, otherwise find find an available unique username
// 		if (!err) {
// 			// If an available unique username was found call the callback method, otherwise call the 'findUniqueUsername' method again with a new suffix
// 			if (!user) {
// 				callback(possibleUsername);
// 			} else {
// 				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
// 			}
// 		} else {
// 			callback(null);
// 		}
// 	});
// };


// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'User' model out of the 'UserSchema'
var User = mongoose.model('User', UserSchema);

module.exports = User;
