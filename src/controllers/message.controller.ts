const messageService = require("../services/message.service");
import { Message } from "../interfaces/message";

module.exports = (router) => {
  router.get("/chat/history", async (ctx, next) => {
    ctx.body = await (<Message[]>messageService.getAllMessages());
    await next();
  });
};
