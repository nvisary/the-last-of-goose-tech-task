import "reflect-metadata";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import path from "path";
import authRoutes from "./modules/auth/auth.routes";
import roundRoutes from "./modules/rounds/rounds.routes";
import fastifyStatic from "@fastify/static";
import { startRoundStatusUpdater } from "./modules/rounds/rounds.background";
import authPlugin from "./plugins/auth";
import { AppDataSource } from "./config/data-source";

const PORT = parseInt(process.env.PORT || "3000", 10);

const buildServer = () => {
  const server = Fastify({
    logger: true,
  });

  server.register(cookie);
  server.register(authPlugin);

  server.register(fastifyStatic, {
    root: path.join(__dirname, "../../frontend/dist"),
    prefix: "/",
  });

  server.setNotFoundHandler((request, reply) => {
    if (request.method !== "GET") {
      reply.code(404).send({ message: "Not Found" });
      return;
    }
    reply.sendFile("index.html");
  });

  server.register(authRoutes, { prefix: "/api/auth" });
  server.register(roundRoutes, { prefix: "/api/rounds" });

  return server;
};

const start = async () => {
  const server = buildServer();
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    await server.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Server listening on http://localhost:${PORT}`);

    startRoundStatusUpdater();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
