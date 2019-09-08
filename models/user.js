
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, requiered: true, unique: true },
    hashedPassword: { type: String, requiered: true },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);
module.exports = User;
