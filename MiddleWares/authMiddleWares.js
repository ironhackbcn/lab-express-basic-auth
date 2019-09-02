/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable consistent-return */

// const isUserLoggedIn = (req, res, next) => {
//   console.log('entro en is user logged in');
//   if (req.session.currentUser) {
//     next();
//   } else {
//     req.flash('error', 'You need to login to use stay here!!!');
//     res.redirect('auth/login');
//   }
// };

// const notifications = () => (req, res, next) => {
//   // We extract the messages separately cause we call req.flash() we'll clean the object flash.
//   console.log('entro en los mensajes');
//   res.locals.errorMessages = req.flash('error');
//   res.locals.infoMessages = req.flash('info');
//   res.locals.dangerMessages = req.flash('danger');
//   res.locals.successMessages = req.flash('success');
//   res.locals.warningMessages = req.flash('warning');
//   next();
// };

// const isNotFFilled = (req, res, next) => {
//   console.log('Estoy en isNotffilled');
//   const { username, password } = req.body;
//   if (username !== '' && password !== '') {
//     res.locals.auth = req.body;
//     next();
//   }
//   req.flash('error', 'Fields can not be empty!');
//   res.redirect(req.path);
// };

// module.exports = { isUserLoggedIn, notifications, isNotFFilled };
