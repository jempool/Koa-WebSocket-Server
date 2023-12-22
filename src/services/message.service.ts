import { Message } from "../models/message.model.ts";

export async function getAllMessages() {
  return await Message.find();
}

export async function addMessage(message) {
  const newMessage = new Message({ ...message });
  return await newMessage.save();
}
