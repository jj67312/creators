module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session.user_id) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in!');
    return res.redirect('/login');
  }
  next();
};