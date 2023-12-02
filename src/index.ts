import Koa from "koa";
import Router from "koa-router";
import { createServer } from "http";
import mongoose from "mongoose";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";

import { PORT, DATABASE_URL, DATABASE_NAME } from "./utils/constants.ts";
import socketIO from "./webSockets/websockets.ts";
import messageController from "./controllers/message.controller.ts";
import authController from "./controllers/auth.controller.ts";

const app = new Koa();
const router = new Router();

// Enable CORS for all routes
app.use(cors());

// Controllers
messageController(router);
authController(router);

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

// Create HTTP server
const httpServer = createServer(app.callback());

// WebSockets
socketIO(httpServer);

// Start server
const start = async () => {
  try {
    await mongoose.connect(`${DATABASE_URL}/${DATABASE_NAME}`);
    httpServer.listen(PORT, () =>
      console.log(`Server started on port ${PORT}`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
