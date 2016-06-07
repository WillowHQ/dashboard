exports.render = function(req, res) {
  if (req.session.lastVisit) {
    console.log(req.session.lastVisit);
  }
  console.log(JSON.stringify(req.user));
  req.session.lastVisit = new Date();
  res.render('pages/landing', {
    userName: req.user ? req.user.slack.real_name : '',
    userFullName: req.user ? req.user.fullName : '',
    email: req.user ? req.user.username : ''
  });
};
