import React from "react";
import IconWrapper from "./IconWrapper";

interface StatsProps {
  total: number;
  upcoming: number;
  completed: number;
}

const DashboardStats: React.FC<StatsProps> = ({
  total,
  upcoming,
  completed,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
        <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
          <IconWrapper name="LayoutGrid" />
        </div>
        <div>
          <p className="text-sm text-zinc-400 font-medium">Total Tasks</p>
          <h4 className="text-2xl font-bold text-white">{total}</h4>
        </div>
      </div>
      <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
        <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
          <IconWrapper name="Timer" />
        </div>
        <div>
          <p className="text-sm text-zinc-400 font-medium">Active Schedules</p>
          <h4 className="text-2xl font-bold text-white">{upcoming}</h4>
        </div>
      </div>
      <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
        <div className="bg-purple-500/10 p-3 rounded-lg text-purple-400">
          <IconWrapper name="CheckCircle" />
        </div>
        <div>
          <p className="text-sm text-zinc-400 font-medium">Completed</p>
          <h4 className="text-2xl font-bold text-white">{completed}</h4>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
