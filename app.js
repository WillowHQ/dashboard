
// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log(process.env.NODE_ENV);

// Load the module dependencies
var mongoose = require('./server/config/mongoose'),
		express  = require('./server/config/express'),
		passport = require('./server/config/passport');

// Create a new Mongoose connection instance
var db = mongoose();

//console.log(db);
// Create a new Express application instance
var app = express();

// Configure the Passport middleware
var passport = passport();

// Use the Express application instance to listen to the '9812' port
app.listen(12557);

// Log the server status to the console
console.log('Server running at http://107.170.21.178:12557/');

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;
