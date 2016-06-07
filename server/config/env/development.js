// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'development' environment configuration object
module.exports = {
  // If I push this code to dev and the db is still localhost I owe Josh + Thom $5 each - Shane
	db: 'mongodb://thom:letmein1@ds011251.mlab.com:11251/fitpath',
	sessionSecret: 'developmentSessionSecret',
  phoneNumbers: {
    messages: '+12898062194',
    reminders: '+12044005478'
  },
	facebook: {
		clientID: '237058900007908',
		clientSecret: '756eb97b58fb72f845277f0e2f51fda2',
		callbackURL: 'http://localhost:8081/oauth/facebook/callback'
	},
	twitter: {
		clientID: 'Twitter Application ID',
		clientSecret: 'Twitter Application Secret',
		callbackURL: 'http://localhost:8081/oauth/twitter/callback'
	},
	google: {
		clientID: 'Google Application ID',
		clientSecret: 'Google Application Secret',
		callbackURL: 'http://localhost:8081/oauth/google/callback'
	}
};
