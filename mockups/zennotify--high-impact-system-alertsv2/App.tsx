import React, { useState, useCallback } from "react";
import { NotificationScenario, NotificationType, AIResponse } from "./types";
import NotificationOverlay from "./components/NotificationOverlay";
import { getNotificationBriefing } from "./services/geminiService";

const DEFAULT_SCENARIOS: NotificationScenario[] = [
  // --- CLASSIC STYLE (Matching Image Mock) ---
  {
    id: "standup-classic",
    type: NotificationType.MEETING,
    style: "classic",
    title: "Daily Standup",
    subtitle: "Microsoft Teams Meeting",
    timeRange: "9:00 AM – 9:15 AM",
    platform: "Teams",
    participants: [
      { initials: "CE", color: "bg-gray-500" },
      { initials: "RH", color: "bg-blue-600" },
      { initials: "JA", color: "bg-emerald-600" },
      { initials: "JR", color: "bg-orange-600" },
      { initials: "KA", color: "bg-purple-600" },
    ],
    durationSeconds: 300,
    aiContext: "Quick sync to align on today's tasks.",
    primaryAction: "Join",
    secondaryAction: "Dismiss",
  },
  {
    id: "shutdown-classic",
    type: NotificationType.SHUTDOWN,
    style: "classic",
    title: "System Shutdown",
    subtitle: "IT Maintenance Alert",
    timeRange: "Shutdown in 5:00",
    platform: "System",
    durationSeconds: 300,
    aiContext: "System update required for security patches.",
    primaryAction: "Restart",
    secondaryAction: "Postpone",
  },
  // --- ZEN STYLE (Original High-Impact Versions) ---
  {
    id: "sync-zen",
    type: NotificationType.MEETING,
    style: "zen",
    title: "Engineering Sync",
    subtitle: "Roadmap Review & API Updates",
    durationSeconds: 300,
    aiContext: "High-priority technical strategy alignment.",
    primaryAction: "Join Room Now",
    secondaryAction: "Snooze 2m",
  },
  {
    id: "security-zen",
    type: NotificationType.SHUTDOWN,
    style: "zen",
    title: "Security Update",
    subtitle: "Kernel Upgrade Required",
    durationSeconds: 120,
    aiContext: "Immediate action required for system integrity.",
    primaryAction: "Save & Restart",
    secondaryAction: "Delay 10m",
  },
];

const App: React.FC = () => {
  const [activeScenario, setActiveScenario] =
    useState<NotificationScenario | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const triggerScenario = async (scenario: NotificationScenario) => {
    setIsLoading(true);
    setActiveScenario(scenario);

    const briefing = await getNotificationBriefing(
      scenario.type,
      scenario.title,
      scenario.aiContext
    );
    setAiResponse(briefing);
    setIsLoading(false);
  };

  const handleAction = useCallback(() => {
    setActiveScenario(null);
    setAiResponse(null);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-[#1e2124] text-white">
      {!activeScenario ? (
        <div className="relative z-10 w-full max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">
              Notification Mock Comparison
            </h1>
            <p className="text-gray-400">
              Compare High-Impact "Zen" alerts with the structured "Classic"
              layout
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Classic Section */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
                Structured Classic
              </h2>
              {DEFAULT_SCENARIOS.filter((s) => s.style === "classic").map(
                (s) => (
                  <button
                    key={s.id}
                    onClick={() => triggerScenario(s)}
                    className="w-full flex flex-col p-6 rounded-2xl bg-[#2f3136] border border-white/5 hover:border-white/20 transition-all text-left group"
                  >
                    <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                    <p className="text-gray-500 text-sm">{s.subtitle}</p>
                  </button>
                )
              )}
            </div>

            {/* Zen Section */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest px-2">
                High-Impact Zen
              </h2>
              {DEFAULT_SCENARIOS.filter((s) => s.style === "zen").map((s) => (
                <button
                  key={s.id}
                  onClick={() => triggerScenario(s)}
                  className="w-full flex flex-col p-6 rounded-2xl bg-indigo-900/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-left group"
                >
                  <h3 className="text-lg font-bold text-indigo-100 mb-1">
                    {s.title}
                  </h3>
                  <p className="text-indigo-400/60 text-sm">{s.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <NotificationOverlay
          scenario={activeScenario}
          aiData={aiResponse}
          onAction={handleAction}
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-indigo-400">
              Syncing insights...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
