const express = require('express');
const router = express.Router();

// Utitlities:
const catchAsync = require('../utils/catchAsync');

// Models
const Creator = require('../models/Creator');


// Creator controller
const creators = require('../controllers/creators');

// middleware:
const { isLoggedIn } = require('../utils/middleware');

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

router
  .route('/register')
  .get(creators.renderRegister)
  .post(catchAsync(creators.register));

router
  .route('/login')
  .get(creators.renderLogin)
  .post(catchAsync(creators.login));

router.get('/logout', creators.logout);

router.get('/creators', paginatedResults(Creator), creators.allCreators);

module.exports = router;
