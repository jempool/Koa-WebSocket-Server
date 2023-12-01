"use strict";

require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const authServices = require("../services/auth.service");
const {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = require("../utils/constants");
import { User } from "../interfaces/user";

module.exports = (router) => {
  router.post("/auth/signup", async (ctx, next) => {
    const _user: User = ctx.request.body;

    if (await authServices.getUserByEmail(_user.email)) {
      const err = new Error(
        `The email ${_user.email} is already associated with an account`
      );
      ctx.status = 400;
      ctx.body = { message: err.message };
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(_user.password, salt);
      _user.password = hash;
      const newUser = await authServices.createUser(_user);

      const user = {
        name: newUser.name,
        email: newUser.email,
      };
      const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
      const refreshToken = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });
      ctx.body = { user, accessToken, refreshToken };
    }

    await next();
  });

  router.post("/auth/login", async (ctx, next) => {
    const _user: User = ctx.request.body;
    const existingUser = await authServices.getUserByEmail(_user.email);
    if (
      !existingUser ||
      !bcrypt.compareSync(_user.password, existingUser.password)
    ) {
      const err = new Error(`Incorrect email or password.`);
      ctx.status = 400;
      ctx.body = { message: err.message };
    } else {
      const user = {
        name: existingUser.name,
        email: existingUser.email,
      };
      const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
      const refreshToken = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });
      ctx.body = { user, accessToken, refreshToken };
    }
    await next();
  });
};
