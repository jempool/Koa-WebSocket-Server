"use strict";

const { User } = require("../models/user.js");

module.exports = {
  getUserByEmail: async function (email) {
    return await User.findOne({ email });
  },

  createUser: async function (user) {
    const newUser = new User({ ...user });
    return await newUser.save();
  },
};
