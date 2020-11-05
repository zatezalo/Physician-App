const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth : {
    api_key: 'API_KEY'
  }
}));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');

  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
      pageTitle: 'Log in',
      path: '/login',
      errorMessage: message
  })
};

exports.postLogin = (req, res, next) => {
  const email     = req.body.email;
  const password  = req.body.password;

  User.findOne({email: email})
  .then(user => {
    if(!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/');
    }

    bcrypt.compare(password, user.password)
    .then(correctPassword => {
      if(correctPassword) {
        req.session.isLoggedIn  = true;
        req.session.user        = user;

        return req.session.save(err => {
          res.redirect('/profile');
        });
      }
      else {
        req.flash('error', 'Invalid email or password.');

        return res.redirect('/');
      }
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
  })
  .catch(err => console.log(err));
    
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');

  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const name            = req.body.name;
  const email           = req.body.email;
  const password        = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({email: email})
  .then(userDoc => {
    if(userDoc) {
      req.flash('error', 'E-Mail exists alredy, please pick a different one.');
      return res.redirect('/signup');
    }

    if(password.toString() === confirmPassword.toString()) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/signup');
    }

    return bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword
      })
      return user.save();
    })
    .then(result => {
      res.redirect('/');
      return transporter.sendMail({
        to: email,
        from: 'zatezalo123@gmail.com',
        subject: 'Signup succeeded!',
        html: '<h1>You succesfully signed up!</h1>'
      }).then(result => {
        console.log(result);
      });
    })
    .catch(err => {
      console.log(err);
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message    = req.flash('error');

  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
  const email     = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    User.findOne({email: email})
    .then(user => {
      if(!user) {
        req.flash('error', 'No account with that email found.');
        return res.redirect('/reset')
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    })
    .then(result => {
      res.redirect('/');
      return transporter.sendMail({
        to: email,
        from: 'zatezalo123@gmail.com',
        subject: 'Password reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `
      });
    })
    .catch(err => console.log(err));
  })
};

exports.getNewPassword = (req, res, next) => {
  const token          = req.params.token;
  
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    let message = req.flash('error');

    if(message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'Reset Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    })
  })
  .catch(err => console.log(err));
}

exports.postNewPassword = (req, res, next) => {
  const newPassword     = req.body.password;
  const userId          = req.body.userId;
  const passwordToken   = req.body.passwordToken;

  let resetUser;
  
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId
  })
  .then(user => {
    resetUser = user;
    bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    resetUser.save();
  })
  .then(result => {
    res.redirect('/');
  })
  .catch(err => console.log(err));
}

