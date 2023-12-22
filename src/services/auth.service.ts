import { User } from "../models/user.model.ts";
import { User as IUser } from "../interfaces/user.interface.ts";

export async function getUserByEmail(email: string) {
  return await User.findOne({ email });
}

export async function createUser(user: IUser) {
  const newUser = new User({ ...user });
  return await newUser.save();
}
