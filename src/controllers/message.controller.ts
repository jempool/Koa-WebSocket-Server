import messageService from "../services/message.service";
import { Message } from "../interfaces/message";

export default (router) => {
  router.get("/chat/history", async (ctx, next) => {
    const messages: Message[] = await messageService.getAllMessages();
    ctx.body = messages;
    await next();
  });
};
