import * as MessagesController from "../controllers/message.controller.ts";

export function AddMessagesRoutes(router) {
  router.get("/chat/history", MessagesController.getAllMessages);
}
