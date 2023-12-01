"use strict";

import { Server } from "socket.io";

const dbService = require("../services/message.service");
const {
  WEBSOCKETS_CHAT_EVENT,
  WEBSOCKETS_TYPING_EVENT,
} = require("./../utils/constants.js");

module.exports = async function (httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`${new Date()} - New connection ${socket.id}`);

    // Listening for chat event
    socket.on(WEBSOCKETS_CHAT_EVENT, function (data) {
      dbService.addMessage(data);
      io.sockets.emit(WEBSOCKETS_CHAT_EVENT, data);
    });

    // Listening for typing event
    socket.on(WEBSOCKETS_TYPING_EVENT, function (data) {
      io.sockets.emit(WEBSOCKETS_TYPING_EVENT, data);
      socket.broadcast.emit(WEBSOCKETS_TYPING_EVENT, data);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
};
