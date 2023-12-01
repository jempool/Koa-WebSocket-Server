const { Message } = require("../models/message");

module.exports = {
  getAllMessages: async function () {
    return await Message.find();
  },

  addMessage: async function (message) {
    const newMessage = new Message({ ...message });
    return await newMessage.save();
  },
};
