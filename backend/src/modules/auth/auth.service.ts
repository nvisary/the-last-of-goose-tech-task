import { findUserByUsername, createUser } from "../users/user.service";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { User, UserRole } from "../../entities/User";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

interface LoginInput {
  username: string;
  password: string;
}

export const login = async (
  data: LoginInput
): Promise<{ token: string; user: User } | null> => {
  const { username, password } = data;

  let user = await findUserByUsername(username);

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
  } else {
    let role: UserRole = UserRole.SURVIVOR;
    if (username.toLowerCase() === "admin") {
      role = UserRole.ADMIN;
    } else if (username.toLowerCase() === "никита") {
      role = UserRole.NIKITA;
    }
    user = await createUser({ username, password, role });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return { token, user };
};
