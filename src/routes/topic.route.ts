import * as TopicsController from "../controllers/topic.controller.ts";

export function AddTopicsRoutes(router) {
  router.get("/topics/today", TopicsController.TodaysTopic);
}
