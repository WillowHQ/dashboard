// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'development' environment configuration object
//'mongodb://thom:letmein1@ds011251.mlab.com:11251/fitpath'
module.exports = {
  // If I push this code to dev and the db is still localhost I owe Josh + Thom $5 each - Shane
	//db: 'mongodb://thom:letmein1@ds011251.mlab.com:11251/fitpath',
	db: 'mongodb://josh:letmein1@ds011765.mlab.com:11765/awesomebox',
  // db: 'mongodb://shane:letmein1@localhost:27017/development',
  sessionSecret: 'developmentSessionSecret',
  phoneNumbers: {
    messages: '+12898062194',
		//real 12044005478
    reminders: '+15065000639'
  },
	facebook: {
		clientID: '237058900007908',
		clientSecret: '756eb97b58fb72f845277f0e2f51fda2',
		callbackURL: 'http://107.170.21.178:12557/oauth/facebook/callback'
	},
	twitter: {
		clientID: 'Twitter Application ID',
		clientSecret: 'Twitter Application Secret',
		callbackURL: 'http://107.170.21.178:8081/oauth/twitter/callback'
	},
	google: {
		clientID: 'Google Application ID',
		clientSecret: 'Google Application Secret',
		callbackURL: 'http://107.170.21.178:8081/oauth/google/callback'
	}
};
