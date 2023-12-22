import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors.ts";

const authMiddleware = async (ctx, next) => {
  const currentPath = ctx.request.path;
  const publicPaths = ["/auth/signup", "/auth/login", "/auth/refresh"];

  if (publicPaths.includes(currentPath)) {
    await next();
    return;
  }

  try {
    const tokenBearer = ctx.request.headers["authorization"];

    if (!tokenBearer) {
      throw new UnauthorizedError("Missing token, try login again.");
    }

    const parts = tokenBearer.split(" ");
    if (parts.length !== 2) {
      throw new UnauthorizedError("Invalid token format, try login again.");
    }

    const scheme = parts[0];
    const token = parts[1];

    // Ensure the Authorization header has the correct format
    if (!/^Bearer$/i.test(scheme)) {
      throw new UnauthorizedError("Invalid token, try login again.");
    }

    // Verify the JWT token
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as jwt.JwtPayload;

    ctx.state.user = decoded.user;
    await next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      throw new UnauthorizedError("Invalid token, try login again.");
    } else {
      throw err;
    }
  }
};

export { authMiddleware };
