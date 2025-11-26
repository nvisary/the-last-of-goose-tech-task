import { FastifyRequest, FastifyReply } from "fastify";
import {
  createRound,
  getAllRounds,
  getRoundById,
  processTap,
  deleteRound,
} from "./rounds.service";

interface CreateRoundBody {
  duration?: number;
  cooldown?: number;
}

export const createRoundHandler = async (
  request: FastifyRequest<{ Body: CreateRoundBody }>,
  reply: FastifyReply
) => {
  const user = request.user;
  const { duration, cooldown } = request.body || {};

  if (!user || user.role !== "ADMIN") {
    return reply
      .code(403)
      .send({ message: "Forbidden: Only admins can create rounds" });
  }

  try {
    const round = await createRound(duration, cooldown);
    return reply.code(201).send(round);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Internal Server Error" });
  }
};

export const getAllRoundsHandler = async (
  _: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const rounds = await getAllRounds();
    return reply.code(200).send(rounds);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Internal Server Error" });
  }
};

export const getRoundByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const user = request.user;

  try {
    const round = await getRoundById(id, user?.id);
    if (!round) {
      return reply.code(404).send({ message: "Round not found" });
    }
    return reply.code(200).send(round);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Internal Server Error" });
  }
};

export const tapHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id: roundId } = request.params;
  const user = request.user;

  if (!user) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  try {
    const result = await processTap(roundId, user);
    if (!result) {
      return reply.code(400).send({ message: "Could not process tap" });
    }
    return reply.code(200).send(result);
  } catch (e: any) {
    console.error(e);
    return reply
      .code(500)
      .send({ message: e.message || "Internal Server Error" });
  }
};

export const deleteRoundHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const user = request.user;
  const { id } = request.params;

  if (!user || user.role !== "ADMIN") {
    return reply
      .code(403)
      .send({ message: "Forbidden: Only admins can delete rounds" });
  }

  try {
    const deleted = await deleteRound(id);
    if (deleted) {
      return reply.code(204).send();
    } else {
      return reply.code(404).send({ message: "Round not found" });
    }
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Internal Server Error" });
  }
};
