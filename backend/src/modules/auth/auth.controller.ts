import { FastifyRequest, FastifyReply } from "fastify";
import { login } from "./auth.service";

interface LoginInput {
  username?: string;
  password?: string;
}

export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return reply
      .code(400)
      .send({ message: "Username and password are required" });
  }

  try {
    const result = await login({ username, password });

    if (!result) {
      return reply.code(401).send({ message: "Invalid username or password" });
    }

    const { token, user } = result;

    return reply
      .setCookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // send cookie over HTTPS only in production
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      })
      .code(200)
      .send({ user });
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Internal Server Error" });
  }
};
