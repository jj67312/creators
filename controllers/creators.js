const Creator = require('../models/Creator');

module.exports.register = async (req, res) => {
  try {
    const { password, username, profession } = req.body.user;
    // Create new user instance by passing the email and the username
    const newCreator = new Creator({ username, profession });
    // Takes the the new user and the password
    const registeredCreator = await Creator.register(newCreator, password);
    req.login(registeredCreator, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash('success', `Welcome ${registeredCreator.username}!`);
        res.redirect('/creators?page=1&limit=1');
      }
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

module.exports.login = async (req, res) => {
  req.flash('success', `Welcome back ${req.user.username}`);
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect('/creators?page=1&limit=1');
};

module.exports.logout = (req, res) => {
  const username = req.user.username;
  req.logout(function (err) {
    req.flash('success', `See you soon ${username}!`);
    res.redirect('/creators?page=1&limit=1');
  });
};

module.exports.renderRegister = (req, res) => {
  res.render('creators/register');
};

module.exports.renderLogin = (req, res) => {
  res.render('creators/login.ejs');
};

module.exports.allCreators = async (req, res) => {
  const allCreators = res.paginatedResults.results;
  res.render('creators/allCreators.ejs', { allCreators });
};
