var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User'),
    winston = require('winston');

module.exports = function() {
  passport.use(new LocalStrategy(function(username, password, done) {
    winston.info('Attempting to authenticate user:');
    winston.info(username);
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, {
          message: 'Unknown user'
        });
      }

      winston.info('The user\'s password is:');
      winston.info(user.password);
      winston.info('And the password that was attempted was: ');
      winston.info(password);
      winston.info(user.hashPassword(password));

      if (!user.authenticate(password)) {
        winston.info();
        winston.info('Something is wrong with the user. The user is:');
        winston.info(JSON.stringify(user));
        winston.info('The user\'s password is:');
        winston.info(user.password);
        winston.info('And the password that was attempted was: ');
        winston.info(user.hashPassword(password));
        winston.info();
        return done(null, false, {
          message: 'Invalid password'
        });
      }

      return done(null, user);
      });
  }));
};
