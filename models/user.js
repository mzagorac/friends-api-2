const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'please provide id of the user'],
  },
  firstName: {
    type: String,
    required: [true, 'first name is required'],
  },
  surname: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  friends: {
    type: [Number],
  },
});

module.exports = {
  User: model('User', UserSchema),
};
