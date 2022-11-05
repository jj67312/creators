const Creator = require('../models/Creator');

module.exports.register = async (req, res) => {
  const { password, username, profession } = req.body.user;
  // Create new user instance by passing the email and the username
  const newCreator = new Creator({ username, profession, password });
  await newCreator.save();
  req.session.user_id = newCreator._id;
  res.redirect('/creators');
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  const foundCreator = await Creator.findAndValidate(username, password);
  if (foundCreator) {
    req.session.user_id = foundCreator._id;
    req.flash('success', `Welcome back ${foundCreator.username}`);
    res.redirect('/creators?page=1&limit=1');
  } else {
    req.flash('error', `Login failed!`);
    res.redirect('/login');
  }
};

module.exports.logout = async (req, res) => {
  const creator = await Creator.findById(req.session.user_id);
  req.session.user_id = null;
  req.flash('success', `See you soon ${creator.username}`);
  res.redirect('/creators?page=1&limit=1');

  // const username = req.user.username;
  // req.logout(function (err) {
  //   req.flash('success', `See you soon ${username}!`);
  //   res.redirect('/creators?page=1&limit=1');
  // });
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
