import * as Koa from "koa";
import * as Router from "koa-router";
import { createServer } from "http";
import mongoose from "mongoose";
import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyParser from "koa-bodyparser";
import * as cors from "@koa/cors";

import { PORT, DATABASE_URL, DATABASE_NAME } from "./utils/constants";

const socketIO = require("./webSockets/websockets");

const app = new Koa();
const router = new Router();

// Enable CORS for all routes
app.use(cors());

// import { authRouter } from "./routes/auth";
const messageController = require("./controllers/message.controller");
const authController = require("./controllers/auth.controller");
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
