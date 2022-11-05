const Payment = require('../models/Payment');
const Creator = require('../models/Creator');

module.exports.renderDonate = async (req, res) => {
  const { id } = req.params;
  const creator = await Creator.findById(id);
  res.render('creators/donate.ejs', { creator });
};

module.exports.donate = async (req, res) => {
  const { amount, currency, message, name } = req.body;
  const receiverId = req.params.id;
  const senderId = req.session.user_id;

  const receiverCreator = await Creator.findById(receiverId);
  const senderCreator = await Creator.findById(senderId);

  if (!receiverCreator._id.equals(senderCreator._id)) {
    const newPayment = new Payment({
      currency: currency,
      amount: amount,
      message: message,
      name: name,
    });
    newPayment.receiver = receiverCreator._id;
    newPayment.sender = senderCreator._id;

    receiverCreator.receivedFrom.push(senderCreator._id);
    senderCreator.donatedTo.push(receiverCreator._id);

    await newPayment.save();
    await receiverCreator.save();
    await senderCreator.save();

    req.flash(
      'success',
      `You paid ${amount} ${currency}(s) to ${receiverCreator.username}`
    );
    res.redirect(`/payments/${receiverId}`);
  } else {
    req.flash('error', `Payment failed please try again!`);
    res.redirect(`/payments/${receiverId}`);
  }
};


// find donations made by the current creator to any another creator:
module.exports.findDonation = async (req, res) => {
  const currCreator = await Creator.findById(req.session.user_id);
  const targetCreator = await Creator.findById(req.params.id);
  // find all donations from currCreator to targetCreator:
  let allDonationsToTarget = await Payment.find({
    receiver: targetCreator._id,
    sender: currCreator._id,
  });
  res.json(allDonationsToTarget);
};
