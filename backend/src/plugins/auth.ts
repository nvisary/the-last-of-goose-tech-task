import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export interface UserPayload {
  id: string;
  username: string;
  role: "ADMIN" | "SURVIVOR" | "NIKITA";
}

declare module "fastify" {
  interface FastifyRequest {
    user?: UserPayload;
  }
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

async function authPlugin(server: FastifyInstance) {
  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = request.cookies.token;
        if (!token) {
          throw new Error("Missing token");
        }

        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
        request.user = decoded;
      } catch (err) {
        reply.code(401).send({ message: "Unauthorized" });
      }
    }
  );
}

export default fp(authPlugin);
