import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@widgets/Header";
import { useUserStore } from "@entities/User/model/store";
import { getAllRounds, deleteRound } from "@entities/Round/api";
import type { Round } from "@entities/Round/model/types";
import { RoundCard } from "@entities/Round/ui/RoundCard";
import { Button } from "@shared/ui/Button";
import { Input } from "@shared/ui/Input";
import { createRound } from "@features/CreateRound/api/createRound";

export const RoundsListPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [duration, setDuration] = useState<string>("2");
  const [cooldown, setCooldown] = useState<string>("30");

  const fetchRounds = async () => {
    try {
      const data = await getAllRounds();
      setRounds(data);
    } catch (error) {
      console.error("Failed to fetch rounds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();

    // Auto-refresh list every 5 seconds to keep statuses up to date
    const interval = setInterval(fetchRounds, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRound = async () => {
    setIsCreating(true);
    try {
      const durationNum = parseInt(duration) || 2;
      const cooldownNum = parseInt(cooldown) || 30;
      const newRound = await createRound(durationNum, cooldownNum);

      navigate(`/rounds/${newRound.id}`);
    } catch (error) {
      console.error("Failed to create round:", error);
      alert("Failed to create round");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteRound = async (id: string) => {
    try {
      await deleteRound(id);
      fetchRounds();
    } catch (error) {
      console.error("Failed to delete round:", error);
      alert("Failed to delete round");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {user?.role === "ADMIN" && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Game Management
                </h2>
                <p className="text-sm text-gray-500">
                  You are an admin and can create new rounds.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-48">
                <Input
                  label="Duration (min)"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Input
                  label="Cooldown (sec)"
                  type="number"
                  min="0"
                  value={cooldown}
                  onChange={(e) => setCooldown(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48 pb-0.5">
                <Button onClick={handleCreateRound} isLoading={isCreating}>
                  Create Round
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : rounds.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border-dashed border-2 border-gray-200">
              <p className="text-gray-500 text-lg">No rounds available</p>
            </div>
          ) : (
            rounds.map((round) => (
              <RoundCard
                key={round.id}
                round={round}
                onDelete={
                  user?.role === "ADMIN" ? handleDeleteRound : undefined
                }
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};
