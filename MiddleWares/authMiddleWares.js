/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable consistent-return */

const isUserLoggedIn = (req, res, next) => {
  // console.log('entro en is user logged in');
  if (req.session.currentUser) {
    next();
  } else {
    req.flash('error', 'You need to login to stay here!!!');
    res.redirect('login');
  }
};


const isNotFFilled = (req, res, next) => {
  // console.log('los campos estan llenos');
  const { username, password } = req.body;
  if (username !== '' && password !== '') {
    // console.log('the fields are filled');
    res.locals.auth = req.body;
    next();
  } else {
    // console.log(`this is the contents of req.path ${req.path}`);
    req.flash('error', 'Fields can not be empty!');
    res.redirect('login');
  }
};

const notifications = () => (req, res, next) => {
  // We extract the messages separately cause we call req.flash() we'll clean the object flash.
  // console.log('entro en los mensajes');
  res.locals.errorMessages = req.flash('error');
  res.locals.infoMessages = req.flash('info');
  res.locals.dangerMessages = req.flash('danger');
  res.locals.successMessages = req.flash('success');
  res.locals.warningMessages = req.flash('warning');
  next();
};


module.exports = { isUserLoggedIn, notifications, isNotFFilled };
