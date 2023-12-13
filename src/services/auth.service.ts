import { User } from "../models/user.model.ts";

const getUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

const createUser = async (user: typeof User) => {
  const newUser = new User({ ...user });
  return await newUser.save();
};

export default {
  getUserByEmail,
  createUser,
};
