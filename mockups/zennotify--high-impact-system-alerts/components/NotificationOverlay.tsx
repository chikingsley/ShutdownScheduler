import React, { useState, useEffect } from "react";
import { NotificationScenario, NotificationType, AIResponse } from "../types";

interface NotificationOverlayProps {
  scenario: NotificationScenario;
  aiData: AIResponse | null;
  onAction: (
    actionType: "primary" | "secondary" | "dismiss" | "snooze"
  ) => void;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({
  scenario,
  aiData,
  onAction,
}) => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  );
  const [secondsRemaining, setSecondsRemaining] = useState(
    scenario.durationSeconds
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (s: number) => {
    const mins = Math.floor(s / 60);
    return mins === 1 ? "1 minute" : `${mins} minutes`;
  };

  const isShutdown = scenario.type === NotificationType.SHUTDOWN;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#444444] text-white font-sans overflow-hidden">
      {/* Top Right Clock */}
      <div className="absolute top-6 right-8 text-sm font-bold tracking-tight text-white/90">
        {currentTime}
      </div>

      <div className="flex flex-col items-center max-w-2xl w-full text-center">
        {/* Top Illustration (Simplified SVG Mock of the alarm clock/plants) */}
        <div className="mb-12 relative">
          <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Alarm Clock */}
            <circle cx="60" cy="50" r="22" fill="#FF8A65" />
            <circle cx="60" cy="50" r="18" fill="white" />
            <rect x="59" y="38" width="2" height="12" rx="1" fill="#444" />
            <rect x="59" y="48" width="8" height="2" rx="1" fill="#444" />
            <path
              d="M42 32L36 26M78 32L84 26"
              stroke="#FF8A65"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Plants */}
            <path
              d="M30 65C30 55 45 55 45 65V72H30V65Z"
              fill="#FFA726"
              opacity="0.8"
            />
            <path
              d="M85 65C85 55 95 55 95 65V72H85V65Z"
              fill="#66BB6A"
              opacity="0.8"
            />
            <rect
              x="25"
              y="70"
              width="70"
              height="2"
              fill="white"
              opacity="0.2"
            />
          </svg>
        </div>

        {/* Title Section */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-[3px] h-8 bg-purple-500 rounded-full"></div>
          <h1 className="text-4xl font-bold tracking-tight">
            {scenario.title}
          </h1>
        </div>

        <div className="text-xl font-bold text-white/90 mb-2 uppercase tracking-wide">
          {scenario.timeRange}
        </div>

        <div className="text-sm text-white/60 mb-6 font-medium">
          The event will start in {formatCountdown(secondsRemaining)}
        </div>

        {/* Small Icons Section */}
        <div className="flex gap-2 mb-6">
          <div className="p-1.5 border border-white/20 rounded-md bg-white/5">
            <svg
              className="w-4 h-4 text-white/60"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            </svg>
          </div>
          <div className="p-1.5 border border-white/20 rounded-md bg-white/5">
            <svg
              className="w-4 h-4 text-white/60"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
            </svg>
          </div>
        </div>

        {/* Platform & Participants */}
        <div className="text-xl font-bold text-white/90 mb-4">
          {scenario.subtitle}
        </div>

        {scenario.participants && (
          <div className="flex justify-center -space-x-2 mb-10">
            {scenario.participants.map((p, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 border-[#444] flex items-center justify-center text-[10px] font-bold ${p.color}`}
              >
                {p.initials}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#444] bg-[#555] flex items-center justify-center text-[10px] font-bold">
              ...
            </div>
          </div>
        )}

        {/* Primary/Secondary Buttons */}
        <div className="flex flex-col gap-3 w-64 mb-12">
          <div className="relative group">
            <button
              onClick={() => onAction("primary")}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all shadow-lg ${
                isShutdown
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-[#f5a623] hover:bg-[#ffb540]"
              } text-black`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              {scenario.primaryAction}
            </button>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 border-l border-black/10">
              <svg
                className="w-3 h-3 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={() => onAction("secondary")}
            className="w-full py-2 rounded-lg font-bold text-sm bg-transparent border border-white/40 hover:bg-white/5 text-white transition-all"
          >
            {scenario.secondaryAction}
          </button>
        </div>

        {/* AI Briefing (Seamlessly integrated) */}
        {aiData && (
          <div className="mb-10 text-white/50 text-sm italic max-w-md animate-in fade-in duration-700">
            "{aiData.briefing}"
          </div>
        )}

        {/* Snooze Row */}
        <div className="mb-8">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
            Snooze
          </div>
          <div className="flex gap-2">
            {["1 minute", "5 minutes", "Until Event"].map((label) => (
              <button
                key={label}
                onClick={() => onAction("snooze")}
                className="px-5 py-2 rounded-lg border border-white/20 text-xs font-medium text-white/80 hover:bg-white/5 transition-all"
              >
                {label}
              </button>
            ))}
            <button className="px-3 py-2 rounded-lg border border-white/20 text-xs font-medium text-white/80 hover:bg-white/5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Customize Link */}
        <button className="flex items-center gap-2 text-[10px] font-bold text-white/40 hover:text-white/80 transition-all uppercase tracking-widest">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Customize this Event
        </button>
      </div>
    </div>
  );
};

export default NotificationOverlay;
