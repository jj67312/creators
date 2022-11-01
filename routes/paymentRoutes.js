const express = require('express');
const router = express.Router();

// Utitlities:
const catchAsync = require('../utils/catchAsync');

const Creator = require('../models/Creator');
const Payment = require('../models/Payment');

const payments = require('../controllers/payments');
const { isLoggedIn } = require('../utils/middleware');

router.get('/:id', isLoggedIn, payments.renderDonate);
router.post('/pay/:id', isLoggedIn, payments.donate);
router.get('/donate/:id', isLoggedIn, payments.findDonation);

module.exports = router;
