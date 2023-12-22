"use strict";

import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import * as authServices from "../services/auth.service.ts";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS,
} from "../utils/constants.ts";
import { User } from "../interfaces/user.interface.ts";

export async function SignUp(ctx, next) {
  const _user: User = ctx.request.body;
  if (await authServices.getUserByEmail(_user.email)) {
    ctx.status = 400;
    ctx.body = {
      message: `The email ${_user.email} is already associated with an account`,
    };
  } else {
    const newUser = await createUser(_user);
    const user = { name: newUser.name, email: newUser.email };
    const tokens = generateTokens(user);
    ctx.body = { user, ...tokens };
  }
  await next();
}

export async function Login(ctx, next) {
  const _user: User = ctx.request.body;
  try {
    const existingUser = await verifyUser(_user);
    const user = { name: existingUser.name, email: existingUser.email };
    const tokens = generateTokens(user);
    ctx.body = { user, ...tokens };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
  await next();
}

export async function Refresh(ctx, next) {
  const { refreshToken, email } = ctx.request.body;
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET) as {
      user: { name: string; email: string };
    };
    if (decoded.user.email !== email) {
      throw new Error("Invalid token, try login again.");
    }
    const user = { name: decoded.user.name, email: decoded.user.email };
    const tokens = generateTokens(user);
    ctx.body = { user, ...tokens };
  } catch (err) {
    ctx.status = 401;
    ctx.body = { message: err.message };
  }
  await next();
}

const verifyUser = async (_user: User) => {
  const existingUser = await authServices.getUserByEmail(_user.email);
  if (
    !existingUser ||
    !bcrypt.compareSync(_user.password, existingUser.password)
  ) {
    throw new Error(`Incorrect email or password.`);
  }
  return existingUser;
};

const createUser = async (_user) => {
  const salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS);
  const hash = bcrypt.hashSync(_user.password, salt);
  _user.password = hash;
  return await authServices.createUser(_user);
};

const generateTokens = (user: { name: string; email: string }) => {
  const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};
