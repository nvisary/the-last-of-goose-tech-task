import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Round } from "./Round";

@Entity()
export class UserRound {
  @PrimaryColumn()
  userId!: string;

  @PrimaryColumn()
  roundId!: string;

  @Column({ default: 0 })
  taps!: number;

  @Column({ default: 0 })
  score!: number;

  @ManyToOne(() => User, (user) => user.rounds, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Round, (round) => round.users, { onDelete: "CASCADE" })
  @JoinColumn({ name: "roundId" })
  round!: Round;
}
