import { FastifyInstance } from "fastify";
import {
  createRoundHandler,
  getAllRoundsHandler,
  getRoundByIdHandler,
  tapHandler,
  deleteRoundHandler,
} from "./rounds.controller";

async function roundRoutes(server: FastifyInstance) {
  server.post("/", {
    preHandler: [server.authenticate],
    handler: createRoundHandler,
  });

  server.get("/", {
    preHandler: [server.authenticate],
    handler: getAllRoundsHandler,
  });

  server.get("/:id", {
    preHandler: [server.authenticate],
    handler: getRoundByIdHandler,
  });

  server.post("/:id/tap", {
    preHandler: [server.authenticate],

    handler: tapHandler,
  });

  server.delete("/:id", {
    preHandler: [server.authenticate],

    handler: deleteRoundHandler,
  });
}

export default roundRoutes;
