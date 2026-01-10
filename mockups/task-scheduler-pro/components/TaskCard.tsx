import React, { useEffect, useState } from "react";
import { ScheduledTask, ActionType, Frequency } from "../types";
import IconWrapper from "./IconWrapper";

interface TaskCardProps {
  task: ScheduledTask;
  onDelete: (id: string) => void;
  onEdit: (task: ScheduledTask) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const diff = task.targetTime - now;

      if (diff <= 0) {
        setTimeLeft("Completed");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      let str = "";
      if (days > 0) str += `${days}d `;
      if (hours > 0) str += `${hours}h `;
      str += `${mins}m ${secs}s`;
      setTimeLeft(str);
    };

    const timer = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(timer);
  }, [task.targetTime]);

  const getActionIcon = (action: ActionType): any => {
    switch (action) {
      case ActionType.SHUTDOWN:
        return "Power";
      case ActionType.RESTART:
        return "RefreshCw";
      case ActionType.SLEEP:
        return "Moon";
      case ActionType.MEETING:
        return "Video";
      case ActionType.REMINDER:
        return "Bell";
      default:
        return "Calendar";
    }
  };

  const getActionColor = (action: ActionType) => {
    switch (action) {
      case ActionType.SHUTDOWN:
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case ActionType.RESTART:
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case ActionType.SLEEP:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case ActionType.MEETING:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case ActionType.REMINDER:
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(task.targetTime));

  const isRecurring = task.frequency !== Frequency.ONCE;
  const daysShort = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div
            className={`p-3 rounded-lg border ${getActionColor(task.action)}`}
          >
            <IconWrapper name={getActionIcon(task.action)} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
                {task.title}
              </h3>
              {isRecurring && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 rounded-md border border-zinc-700 flex items-center gap-1">
                  <IconWrapper name="RotateCcw" size={10} />
                  {task.frequency}
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-col gap-2">
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <span
                  className={`flex items-center gap-1 font-medium ${timeLeft === "Completed" ? "text-zinc-500" : "text-emerald-400"}`}
                >
                  <IconWrapper name="Hourglass" size={14} />
                  {timeLeft}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                <span className="flex items-center gap-1">
                  <IconWrapper name="Calendar" size={14} />
                  {formattedDate}
                </span>
              </div>

              {task.frequency === Frequency.WEEKLY && task.activeDays && (
                <div className="flex gap-1 mt-1">
                  {daysShort.map((day, idx) => {
                    const isActive = task.activeDays?.includes(idx);
                    return (
                      <div
                        key={idx}
                        className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold border transition-colors ${
                          isActive
                            ? "bg-zinc-100 text-black border-zinc-100"
                            : "bg-transparent text-zinc-600 border-zinc-800"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
            title="Edit Task"
          >
            <IconWrapper name="Edit3" size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Cancel Task"
          >
            <IconWrapper name="Trash2" size={18} />
          </button>
        </div>
      </div>

      {task.notes && (
        <p className="mt-4 text-sm text-zinc-500 line-clamp-2 italic">
          "{task.notes}"
        </p>
      )}

      {/* Progress Bar placeholder for visual flair */}
      <div className="mt-5 w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
        <div
          className="bg-zinc-600 h-full transition-all duration-1000"
          style={{ width: timeLeft === "Completed" ? "100%" : "30%" }}
        />
      </div>
    </div>
  );
};

export default TaskCard;
