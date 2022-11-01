const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// this is basically going to add on to our user schema a username and password
const passportLocalMongoose = require('passport-local-mongoose');

const CreatorSchema = new Schema({
  profession: {
    type: String,
    required: true,
  },
  donatedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Creator'
    },
  ],
  receivedFrom: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Creator'
    },
  ],
  
});

// this is basically going to add on to our user schema a username and password
CreatorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Creator', CreatorSchema);
