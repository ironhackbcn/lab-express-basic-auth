/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
},
{
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
