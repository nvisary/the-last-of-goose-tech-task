import { FastifyInstance } from "fastify";
import { loginHandler } from "./auth.controller";

async function authRoutes(server: FastifyInstance) {
  server.post("/login", loginHandler);
}

export default authRoutes;
