import { Topic } from "../interfaces/topic.interface.ts";
import topicService from "../services/topic.service.ts";

export function AddTopicsController(router) {
  router.get("/topics/today", async (ctx, next) => {
    const topics: Topic = await topicService.getTodaysTopic();
    ctx.body = topics;
    await next();
  });
}
