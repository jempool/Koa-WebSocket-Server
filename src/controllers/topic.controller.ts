import { Topic } from "../interfaces/topic.interface.ts";
import * as topicService from "../services/topic.service.ts";

export async function TodaysTopic(ctx, next) {
  const topics: Topic = await topicService.getTodaysTopic();
  ctx.body = topics;
  await next();
}
