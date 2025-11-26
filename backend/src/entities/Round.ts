import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRound } from "./UserRound";

export enum RoundStatus {
  COOLDOWN = "COOLDOWN",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

@Entity()
export class Round {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  @Column({
    type: "enum",
    enum: RoundStatus,
    default: RoundStatus.COOLDOWN,
  })
  status!: RoundStatus;

  @Column({ default: 0 })
  totalScore!: number;

  @OneToMany(() => UserRound, (userRound) => userRound.round)
  users!: UserRound[];
}
