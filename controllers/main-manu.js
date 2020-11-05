const User = require("../models/user");

exports.getProfile = (req, res, next) => {
  let message      = req.flash('error');

  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  
  res.render('main-manu/profile', {
      pageTitle: 'Profile',
      path: '/profile',
      errorMessage: message,
      companyName: 'The Spine House Chiropractic',
      user: req.user
  })
}