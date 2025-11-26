import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRound } from "./UserRound";

export enum UserRole {
  ADMIN = "ADMIN",
  SURVIVOR = "SURVIVOR",
  NIKITA = "NIKITA",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  role!: UserRole;

  @OneToMany(() => UserRound, (userRound) => userRound.user)
  rounds!: UserRound[];
}
