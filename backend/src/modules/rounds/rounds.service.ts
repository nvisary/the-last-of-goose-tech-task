import { AppDataSource } from "../../config/data-source";
import { Round, RoundStatus } from "../../entities/Round";
import { UserRound } from "../../entities/UserRound";
import { UserPayload } from "../../plugins/auth";
import { LessThanOrEqual, EntityManager } from "typeorm";

const roundRepository = AppDataSource.getRepository(Round);

export const createRound = async (
  durationMinutes?: number,
  cooldownSeconds?: number
): Promise<Round> => {
  const durationMs =
    (durationMinutes || parseInt(process.env.ROUND_DURATION || "2", 10)) *
    60 *
    1000;
  const cooldownMs =
    (cooldownSeconds || parseInt(process.env.COOLDOWN_DURATION || "30", 10)) *
    1000;

  const now = new Date();
  const startTime = new Date(now.getTime() + cooldownMs);
  const endTime = new Date(startTime.getTime() + durationMs);

  const round = roundRepository.create({
    startTime,
    endTime,
    status: RoundStatus.COOLDOWN,
  });

  return roundRepository.save(round);
};

export const getAllRounds = async (): Promise<Round[]> => {
  return roundRepository.find({
    order: {
      startTime: "DESC",
    },
  });
};

export const getRoundById = async (
  id: string,
  userId?: string
): Promise<any> => {
  const round = await roundRepository.findOne({
    where: { id },
  });

  if (!round) return null;

  let myScore = 0;
  let myTaps = 0;
  if (userId) {
    const userRound = await AppDataSource.getRepository(UserRound).findOne({
      where: { userId, roundId: id },
    });
    if (userRound) {
      myScore = userRound.score;
      myTaps = userRound.taps;
    } else {
      console.log(`UserRound not found for user ${userId} and round ${id}`);
    }
  } else {
    console.log(`getRoundById called without userId for round ${id}`);
  }
  let winner = null;
  if (round.status === RoundStatus.FINISHED) {
    const winnerRecord = await AppDataSource.getRepository(UserRound).findOne({
      where: { roundId: id },
      order: { score: "DESC" },
      relations: ["user"],
    });
    if (winnerRecord && winnerRecord.user) {
      winner = {
        username: winnerRecord.user.username,
        score: winnerRecord.score,
      };
    }
  }

  return {
    ...round,
    myScore,
    myTaps,
    winner,
  };
};

export const deleteRound = async (id: string): Promise<boolean> => {
  const result = await roundRepository.delete({ id });
  return result.affected !== 0;
};

export const updateRoundStatuses = async (): Promise<void> => {
  const now = new Date();

  await AppDataSource.transaction(async (manager) => {
    const roundsToActivate = await manager.find(Round, {
      where: {
        status: RoundStatus.COOLDOWN,
        startTime: LessThanOrEqual(now),
      },
    });

    const roundsToFinish = await manager.find(Round, {
      where: {
        status: RoundStatus.ACTIVE,
        endTime: LessThanOrEqual(now),
      },
    });

    for (const round of roundsToActivate) {
      round.status = RoundStatus.ACTIVE;
      await manager.save(round);
    }

    for (const round of roundsToFinish) {
      round.status = RoundStatus.FINISHED;
      await manager.save(round);
    }
  });
};

export const processTap = async (
  roundId: string,
  user: UserPayload
): Promise<{ userScore: number; totalScore: number } | null> => {
  return AppDataSource.transaction(async (manager: EntityManager) => {
    const round = await manager.findOne(Round, {
      where: { id: roundId },
    });

    if (!round || round.status !== RoundStatus.ACTIVE) {
      throw new Error("Round is not active");
    }

    if (user.role === "NIKITA") {
      return { userScore: 0, totalScore: round.totalScore };
    }

    let userRound = await manager.findOne(UserRound, {
      where: { userId: user.id, roundId: round.id },
      lock: { mode: "pessimistic_write" },
    });

    if (!userRound) {
      userRound = manager.create(UserRound, {
        userId: user.id,
        roundId: round.id,
        taps: 0,
        score: 0,
      });
    }

      const currentTaps = userRound.taps || 0;
      const newTaps = currentTaps + 1;

      const scoreToAdd = newTaps % 11 === 0 ? 10 : 1;

      userRound.taps = newTaps;
      userRound.score = (userRound.score || 0) + scoreToAdd;

      await manager.save(userRound);

      await manager.increment(Round, { id: roundId }, "totalScore", scoreToAdd);

      const updatedRound = await manager.findOne(Round, {
        where: { id: roundId },
      });

      return {
        userScore: userRound.score,
        myTaps: userRound.taps,
        totalScore: updatedRound!.totalScore,
      };
    }
  );
};
