const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const CreatorSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username cannot be blank!'],
  },
  password: {
    type: String,
    required: [true, 'Username cannot be blank!'],
  },
  profession: {
    type: String,
    required: true,
  },
  donatedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Creator',
      unique: false,
    },
  ],
  receivedFrom: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Creator',
      unique: false,
    },
  ],
});

CreatorSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username });
  const isValid = await bcrypt.compare(password, foundUser.password);
  return isValid ? foundUser : false;
};

CreatorSchema.pre('save', async function (next) {
  // this refers to the particular instance of the model
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Creator', CreatorSchema);
