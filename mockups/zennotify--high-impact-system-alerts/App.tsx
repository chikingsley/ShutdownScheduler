import React, { useState, useCallback } from "react";
import { NotificationScenario, NotificationType, AIResponse } from "./types";
import NotificationOverlay from "./components/NotificationOverlay";
import { getNotificationBriefing } from "./services/geminiService";

const DEFAULT_SCENARIOS: NotificationScenario[] = [
  {
    id: "standup",
    type: NotificationType.MEETING,
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
    durationSeconds: 240,
    aiContext:
      "A quick sync to align on today's tasks and unblock team members.",
    primaryAction: "Join",
    secondaryAction: "Dismiss",
  },
  {
    id: "design-review",
    type: NotificationType.MEETING,
    title: "UX Design Review",
    subtitle: "Google Meet",
    timeRange: "2:00 PM – 3:00 PM",
    platform: "Meet",
    participants: [
      { initials: "MD", color: "bg-pink-600" },
      { initials: "SL", color: "bg-indigo-600" },
      { initials: "BT", color: "bg-amber-600" },
    ],
    durationSeconds: 600,
    aiContext:
      "Reviewing the final mockups for the new notification system. High impact on user experience.",
    primaryAction: "Join",
    secondaryAction: "Dismiss",
  },
  {
    id: "system-reboot",
    type: NotificationType.SHUTDOWN,
    title: "System Shutdown",
    subtitle: "Mandatory IT Maintenance",
    timeRange: "Starts in 5:00",
    platform: "System",
    durationSeconds: 300,
    aiContext:
      "Security patch application. Ensure all work is saved to the cloud before the timer hits zero.",
    primaryAction: "Restart Now",
    secondaryAction: "Postpone",
  },
  {
    id: "deep-work",
    type: NotificationType.CUSTOM,
    title: "Focus Block: Deep Work",
    subtitle: "Flow State Protocol",
    timeRange: "10:00 AM – 12:00 PM",
    platform: "FocusMode",
    durationSeconds: 180,
    aiContext:
      "You have 3 hours of uninterrupted focus scheduled. Shutting down notifications soon.",
    primaryAction: "Begin Session",
    secondaryAction: "Reschedule",
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

  const handleAction = useCallback((type: string) => {
    setActiveScenario(null);
    setAiResponse(null);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-[#1e2124] text-white">
      {!activeScenario ? (
        <div className="relative z-10 w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Notification Mocks</h1>
            <p className="text-gray-400">
              Select a scenario to preview the full-screen notification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEFAULT_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => triggerScenario(s)}
                className="flex flex-col p-6 rounded-2xl bg-[#2f3136] border border-white/5 hover:bg-[#36393f] hover:border-white/10 transition-all text-left group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      s.type === NotificationType.SHUTDOWN
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {s.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.floor(s.durationSeconds / 60)}m warning
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{s.subtitle}</p>
                <div className="mt-auto text-indigo-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  PREVIEW OVERLAY →
                </div>
              </button>
            ))}
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
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#2f3136] p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-white/10">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium">Syncing with Gemini...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
