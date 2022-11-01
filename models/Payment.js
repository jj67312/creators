const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// this is basically going to add on to our user schema a username and password
const passportLocalMongoose = require('passport-local-mongoose');

const PaymentSchema = new Schema({
  receiver: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Creator',
    unique: false,
  },
  sender: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Creator',
    unique: false,
  },
  currency: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
  },
  name: {
    type: String,
  },
});

PaymentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Payment', PaymentSchema);
