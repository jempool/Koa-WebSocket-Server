import messageService from "../services/message.service.ts";
import { Message } from "../interfaces/message.interface.ts";

export async function getAllMessages(ctx, next) {
  const messages: Message[] = await messageService.getAllMessages();
  ctx.body = messages;
  await next();
}
