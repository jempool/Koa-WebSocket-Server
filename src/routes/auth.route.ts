import * as AuthController from "../controllers/auth.controller.ts";

export function AddAuthRoutes(router) {
  router.post("/auth/signup", AuthController.SignUp);
  router.post("/auth/login", AuthController.Login);
  router.post("/auth/refresh", AuthController.Refresh);
}
