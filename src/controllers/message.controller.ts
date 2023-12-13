import messageService from "../services/message.service.ts";
import { Message } from "../interfaces/message.interface.ts";

export default (router) => {
  router.get("/chat/history", async (ctx, next) => {
    const messages: Message[] = await messageService.getAllMessages();
    ctx.body = messages;
    await next();
  });
};
