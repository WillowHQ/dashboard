'use strict'

var User 		 = require('mongoose').model('User'),
    Reminder = require('mongoose').model('Reminder'),
    ReminderResponse = require('mongoose').model('ReminderResponse'),
    path     = require('path'),
		passport = require('passport'),
    winston = require('winston');

exports.render = function(req, res, next) {
  if (req.user) {
    if(req.user.role == "coach") {

      var populateCoach = [
        {
          path: 'clients',
          model: 'User',
          populate: {
            path: 'reminders',
            model: 'Reminder',
            /*populate: {
              path: 'responses',
              model: 'ReminderResponse'
            }*/
          }
        },
        {
          path: 'clients',
          model: 'User',
          populate: {
            path: 'mostRecentResponse',
            model: 'ReminderResponse',
          }
        },
        {
          path: 'clients',
          model: 'User',
          populate: {
            path: 'surveys',
            model: 'Survey',
            populate: {
              path: 'goals',
              populate: {
                path: 'reminder',
                model: 'Reminder'
              }
            }
          }
        },
        {
          path: 'mostRecentResponse'
        },
        {
          path: 'surveys',
          populate: {path: 'reminder'}
        },
        {
          path: 'reminders'
        }
      ]

      winston.info('User.populate');
      User.populate(req.user, populateCoach,
        function(err, user) {
        if(user) {
          winston.info(user.clients.length);
          winston.info('populate dashboard');
          for(var i = 0; i < user.clients.length; i++) {
            user.clients[i].calcStatus();
          }

          res.render(path.resolve('app/index'), {
            user: JSON.stringify(user)
          });
        }
        else {
          winston.error('ERROR LOADING DASHBOARD FOR SOME ODD REASON');
          res.render('landing', {
      			// Set the page title variable
      			title: 'Fitpath',
      			// Set the flash message variable
      			messages: req.flash('There was an error loading clients')
      		});
        }
      });
    } else if (req.user.role == "user")  {

      var populateClient = [
        {
          path: 'reminders',
          model: 'Reminder',
          populate: {
            path: 'responses',
            model: 'ReminderResponse'
          }
        },
        {
          path: 'surveys',
          model: 'Survey',
          populate: {
            path: 'goals',
            populate: {
              path: 'reminder',
              model: 'Reminder'
            }
          }
        }
      ]

      User.populate(req.user,
        populateClient, function(err, user) {
          if(user) {
            res.render(path.resolve('app/index'), {
              user: JSON.stringify(user)
            });
          }
          else {
            res.render('landing', {
              // Set the page title variable
              title: 'Fitpath',
              // Set the flash message variable
              messages: req.flash('There was an error loading clients')
            });
          }
        });
    }
  } else {
    //req.session.returnTo = req.path;
		return res.redirect('/signin');
	}
}
