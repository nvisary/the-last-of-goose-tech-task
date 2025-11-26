import { AppDataSource } from "../../config/data-source";
import { User, UserRole } from "../../entities/User";
import * as bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export const findUserByUsername = async (
  username: string
): Promise<User | null> => {
  return userRepository.findOne({
    where: { username },
  });
};

export const createUser = async (
  data: Omit<User, "id" | "rounds"> & {
    role: UserRole | "ADMIN" | "SURVIVOR" | "NIKITA";
  }
): Promise<User> => {
  const { username, password, role } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const userRole = role as UserRole;

  const user = userRepository.create({
    username,
    password: hashedPassword,
    role: userRole,
  });

  return userRepository.save(user);
};
