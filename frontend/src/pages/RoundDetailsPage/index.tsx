import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Round } from "@entities/Round/model/types";
import { getRoundById, tapRound } from "@entities/Round/api";
import { Card } from "@shared/ui/Card";
import { Button } from "@shared/ui/Button";
import { Header } from "@widgets/Header";
import GoosePng from "../../assets/goose.png";

// const GooseArt = () => (
//   <pre className="font-mono text-[0.6rem] sm:text-xs leading-none text-green-600 select-none pointer-events-none">
//     {`
//           ░░░░░░░░░░░░░░░
//         ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░
//       ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░
//       ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░
//     ░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░
//   ░░▒▒▒▒░░░░▓▓▓▓▓▓▓▓▓▓▓▓░░░░▒▒▒▒░░
//   ░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░
//   ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░
//     ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░
//       ░░░░░░░░░░░░░░░░░░░░░░░░░░
//     `}
//   </pre>
// );

export const RoundDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [round, setRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("--:--");
  const [isTapping, setIsTapping] = useState(false);
  const [gooseSide, setGooseSide] = useState(false);

  const fetchRound = async (isBackground = false) => {
    if (!id) return;
    try {
      if (!isBackground) setLoading(true);
      const data = await getRoundById(id);
      setRound(data);
    } catch (err) {
      console.error(err);
      if (!isBackground) setError("Failed to load round details");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRound();

    const pollInterval = setInterval(() => fetchRound(true), 1000);
    return () => clearInterval(pollInterval);
  }, [id]);

  useEffect(() => {
    if (!round) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      let targetTime = 0;

      if (round.status === "COOLDOWN") {
        targetTime = new Date(round.startTime).getTime();
      } else if (round.status === "ACTIVE") {
        targetTime = new Date(round.endTime).getTime();
      } else {
        setTimeLeft("00:00");
        return;
      }

      const diff = targetTime - now;
      if (diff <= 0) {
        setTimeLeft("00:00");
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [round?.status, round?.startTime, round?.endTime]);

  const handleTap = async () => {
    if (!id || !round || round.status !== "ACTIVE" || isTapping) return;

    setGooseSide((prev) => !prev);

    // Optimistic update
    const previousRound = round;
    setIsTapping(true);

    const currentMyTaps = round.myTaps || 0;
    const optimisticNewTaps = currentMyTaps + 1;
    const optimisticScoreToAdd = optimisticNewTaps % 11 === 0 ? 10 : 1;
    const optimisticMyScore = (round.myScore || 0) + optimisticScoreToAdd;
    const optimisticTotalScore = round.totalScore + optimisticScoreToAdd;

    setRound((prev) =>
      prev
        ? {
            ...prev,
            myScore: optimisticMyScore,
            totalScore: optimisticTotalScore,
            myTaps: optimisticNewTaps,
          }
        : null
    );

    try {
      const { userScore, totalScore, myTaps } = await tapRound(id);
      setRound((prev) =>
        prev
          ? {
              ...prev,
              myScore: userScore,
              totalScore: totalScore,
              myTaps: myTaps,
            }
          : null
      );
    } catch (err) {
      console.error("Tap failed", err);
      setRound(previousRound);
    } finally {
      setIsTapping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !round) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="text-red-500 text-xl">{error || "Round not found"}</div>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/rounds")}
            className="w-auto px-6"
          >
            ← Back to Rounds
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {round.status === "COOLDOWN" && "Cooldown"}
              {round.status === "ACTIVE" && "Round Active!"}
              {round.status === "FINISHED" && "Round Finished"}
            </h2>
            <div className="text-xl font-mono font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
              {round.status === "FINISHED" ? "00:00" : timeLeft}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-8 py-8">
            <div
              onClick={handleTap}
              className={`
                relative p-8 rounded-full transition-all duration-100 select-none
                ${
                  round.status === "ACTIVE"
                    ? "cursor-pointer hover:scale-105 active:scale-95 bg-green-50 hover:bg-green-100 active:bg-green-200 ring-4 ring-green-500/20"
                    : "opacity-50 grayscale cursor-not-allowed bg-gray-100"
                }
              `}
            >
              {/* <GooseArt /> */}
              <img
                src={GoosePng}
                alt="Goose"
                className={`w-64 h-64 transform transition duration-100 ${
                  gooseSide ? "scale-x-[-1]" : "scale-x-100"
                }`}
              />
            </div>

            <div className="text-center space-y-2 h-16">
              {round.status === "COOLDOWN" && (
                <p className="text-lg text-gray-600 animate-pulse">
                  Prepare yourself...
                </p>
              )}
              {round.status === "ACTIVE" && (
                <p className="text-lg text-green-600 font-bold">
                  TAP THE GOOSE!
                </p>
              )}
              {round.status === "FINISHED" && (
                <p className="text-lg text-gray-800 font-bold">Game Over</p>
              )}
            </div>

            <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-sm text-blue-600 mb-1">My Score</div>
                <div className="text-3xl font-bold text-blue-800">
                  {round.myScore || 0}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Total Score</div>
                <div className="text-3xl font-bold text-gray-800">
                  {round.totalScore}
                </div>
              </div>
            </div>

            {round.status === "FINISHED" && round.winner && (
              <div className="w-full mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                <div className="text-yellow-800 font-medium mb-2">
                  🏆 Winner 🏆
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {round.winner.username}
                </div>
                <div className="text-sm text-gray-600">
                  Score: {round.winner.score}
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};
