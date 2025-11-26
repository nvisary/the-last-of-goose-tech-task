import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Round } from "../entities/Round";
import { UserRound } from "../entities/UserRound";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    username: process.env.POSTGRES_USER || "user",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "the_last_of_guss",
    synchronize: true,
    logging: false,
    entities: [User, Round, UserRound],
    migrations: [],
    subscribers: [],
});
