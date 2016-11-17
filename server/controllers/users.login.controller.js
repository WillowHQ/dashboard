'use strict';

// Load the module dependencies
var User 		 = require('mongoose').model('User');
var stripe = require("stripe")("sk_test_jCXXYe0fyydEElNMFTXBw7ZL");


// Create a new error handling controller method
var getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};

// Create a new controller method that renders the signin page
exports.renderSignin = function(req, res, next) {
	// If user is not connected render the signin page, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Use the 'response' object to render the signin page
		res.render('pages/new/index', {
			// Set the page title variable
			title: 'Sign-in Form',
			// Set the flash message variable
			message: req.flash('status')
		});
	} else {
		return res.redirect('/');
	}
};

exports.renderSignup = function(req, res, next) {
	// If user is not connected render the signup page, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Use the 'response' object to render the signup page
		res.render('pages/signup', {
			// Set the page title variable
			title: 'Sign-up Form',
			// Set the flash message variable
			message: req.flash('error')
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that renders the signup page



//Create a new controller method that creates new 'regular' users
exports.signup = function(req, res, next) {
	// If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
	console.log("signup hitttt");
	console.log(req.body);

	if (!req.user) {
		/*
		// Create a new 'User' model instance

		// Get the credit card details submitted by the form
		var token = req.body.stripeToken; // Using Express


		console.log(req.body);
		stripe.customers.create({
			source: token,
			plan: "test",
			email: "payinguser@example.com"
		}, function (err, customer) {
			if(!err){
				//console.log(JSON.stringify(customer));
				var user = new User(req.body);
				var message = null;
				// Set the user provider property
				user.provider = 'local';
				//user.id=customer.id;
				// Try saving the new user document
				user.save(function(err) {
					// If an error occurs, use flash messages to report the error
					if (err) {
						// Use the error handling method to get the error message
						var message = getErrorMessage(err);
						// Set the flash messages
						req.flash('error', message);

						// Redirect the user back to the signup page
						res.redirect('/signup');
					}

					// If the user was created successfully use the Passport 'login' method to login
					req.login(user, function(err) {
						console.log('logged in');
						// If a login error occurs move to the next middleware
						console.log(err);
						if (err) return next(err);

						// Redirect the user back to the main application page
						return res.redirect('/');
					});
				});


				}
			else{
				console.log("errrrrrrrrrrrrrrrrrrrrrrrr");
				console.log(err);
			}

		})

	}
	else {
	console.log("Already logged in");
	return res.redirect('/');
	}
	*/
		var token = req.body.stripeToken; // Using Express

console.log("req.bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
		console.log(req.body);
		stripe.customers.create({
			source: token,
			plan: req.body.options,
			email: req.body.username
		}, function (err, customer) {
			if(!err) {
				//console.log(customer);
				var user = new User(req.body);
				user.stripeId=customer.id;
				var date = new Date();
				//date.setMonth(date.getMonth()-1);
				//user.active_until=date;
				user.willBeCharged= true;
				user.plan= customer.subscriptions.data[0].plan.name;
               user.subscription = customer.subscriptions.data[0].id;
				console.log(customer.subscriptions.data[0]);
				date = new Date( customer.subscriptions.data[0].current_period_end * 1000);
				console.log(date);
				//date.setMonth(date.getMonth()-2);
				user.active_until = date;
				var message = null;
				// Set the user provider property
				user.provider = 'local';
				user.imgUrl= "/assets/img/no_image.gif";

				// Try saving the new user document
				user.save(function (err) {
					// If an error occurs, use flash messages to report the error
					if (err) {
						// Use the error handling method to get the error message
						var message = getErrorMessage(err);
						// Set the flash messages
						req.flash('error', message);

						// Redirect the user back to the signup page
						res.redirect('/signup');
					}

					// If the user was created successfully use the Passport 'login' method to login
					req.login(user, function (err) {
						console.log('logged in');
						// If a login error occurs move to the next middleware
						console.log(err);
						if (err) return next(err);

						// Redirect the user back to the main application page
						return res.redirect('/');
					});
				});
			}
			else{
				res.send(err);
			}
			});

	} else {
		console.log("Already logged in");
		return res.redirect('/');
	}
};

// Generate and Check if Exists
exports.generateUser = function(req, res, next) {
	console.log('generate attempted');
	if (req.body.client) {
		// Create a new 'User' model instance
		if(true) {
			User.findOne({
				username: req.body.client.username
			}, function(err, person) {
				if(!err && !person) {
					var user = new User(req.body.client);
					var message = null;
					// Set the user provider property
					user.provider = 'local';
					// Try saving the new user document
					user.save(function(err) {
						// If an error occurs, use flash messages to report the error
						if (err) {
							// Use the error handling method to get the error message
							var message = getErrorMessage(err);
							console.log(err);
							console.log(message);
							// Set the flash messages
							// req.flash('Error auto generating from slack', message);
						}
						// Success, update Coach Model with new Client ID
						else {
							// Instead of querying the server each time, once finished
							// creating users, push the new user id's onto the req.user
							// (coach) and update at the very end
							User.findByIdAndUpdate(
								req.body.user,
								{$push: {"clients": user._id}},
								{safe: true},
								function(err, model) {
									if(err) {
										console.log(err);
									}
									else {
										//console.log(model);
									}
								}
							);
						}
					});
				} else {
					console.log('user exists');
					return;
				}
			});
		}
	} else {
		console.log("Access Denied.")
		res.send('Access Denied')
	}
}

// Create a new controller method that creates new 'OAuth' users
exports.saveOAuthUserProfile = function(req, profile, done) {
	// Try finding a user document that was registered using the current OAuth provider
	User.findOne({
		provider: profile.provider,
		providerId: profile.providerId
	}, function(err, user) {
		// If an error occurs continue to the next middleware
		if (err) {
			return done(err);
		} else {
			// If a user could not be found, create a new user, otherwise, continue to the next middleware
			if (!user) {

				// Set a possible base username
				var possibleUsername = profile.providerData.name || ((profile.email) ? profile.email.split('@')[0] : '');
				console.log("made it here");
				console.log("profile" + JSON.stringify(profile));
				var name = profile.providerData.name.split(' ');
				user = new User({
					firstName: name[0],
					lastName: name[1],
					username: profile.providerData.name,
					provider: profile.provider,
					providerData: profile.providerData,
					role: 'coach',
					slack_id: profile.providerData.name,
					slack: {
						id: profile.providerData.name,
						name: profile.providerData.name,
						real_name: profile.providerData.name
					},
					coaches: [],
					providerId: profile.providerId,
					facebookId: profile.providerData.id
				});
				user.save(function(err){
					console.log('New user created: ' + JSON.stringify(user));
					return done(err, user);
				})
			} else {
				// Continue to the next middleware
				return done(err, user);
			}
		}
	});
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
	// Use the Passport 'logout' method to logout
	req.logout();

	// Redirect the user back to the main application page
	res.redirect('/');
};

exports.find = function(req, res) {
	User.find({}, function(err, obj){
		res.json(obj);
	})
}
