var winston = require('winston');

exports.render = function(req, res) {
  if (req.session.lastVisit) {
    winston.info(req.session.lastVisit);
  }
  winston.info(JSON.stringify(req.user));
  req.session.lastVisit = new Date();
  res.render('pages/landing2', {
    userName: req.user ? req.user.slack.real_name : '',
    userFullName: req.user ? req.user.fullName : '',
    email: req.user ? req.user.username : ''
  });
};
