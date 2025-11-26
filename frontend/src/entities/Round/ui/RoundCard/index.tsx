import React from 'react';
import { Link } from 'react-router-dom';
import type { Round } from '@entities/Round/model/types';
import { useUserStore } from '@entities/User/model/store.ts';
import { Button } from '@shared/ui/Button/index.tsx';

interface RoundCardProps {
  round: Round;
  onDelete?: (id: string) => void;
}

export const RoundCard: React.FC<RoundCardProps> = ({ round, onDelete }) => {
  const { user } = useUserStore();
  const isAdmin = user?.role === "ADMIN";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-50 border-green-200";
      case "COOLDOWN":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "FINISHED":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="relative bg-white rounded-xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
      {isAdmin && onDelete && (
        <Button
          variant="secondary"
          className="absolute top-2 right-2 !w-auto !py-1 !px-2 text-xs opacity-70 hover:opacity-100"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this round?")) {
              onDelete(round.id);
            }
          }}
        >
          Delete
        </Button>
      )}
      <Link to={`/rounds/${round.id}`} className="block group">
        <div className="flex gap-2 items-center mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                round.status === "ACTIVE"
                  ? "bg-green-500 animate-pulse"
                  : "bg-gray-300"
              }`}
            />
            <span className="font-mono text-sm text-gray-500">Round ID:</span>
            <span className="font-mono text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {round.id}
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
              round.status
            )}`}
          >
            {round.status}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600 pl-4 border-l-2 border-gray-100">
          <div className="flex justify-between max-w-md">
            <span>Start:</span>
            <span className="font-mono text-gray-900">
              {formatDate(round.startTime)}
            </span>
          </div>
          <div className="flex justify-between max-w-md">
            <span>End:</span>
            <span className="font-mono text-gray-900">
              {formatDate(round.endTime)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
