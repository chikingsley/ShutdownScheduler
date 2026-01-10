import React, { useState, useEffect, useCallback } from "react";
import {
  ActionType,
  Frequency,
  ScheduleMode,
  ScheduledTask,
  NewTaskForm,
} from "./types";
import IconWrapper from "./components/IconWrapper";
import TaskCard from "./components/TaskCard";
import DashboardStats from "./components/DashboardStats";
import { parseNaturalLanguageTask } from "./services/geminiService";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [smartPrompt, setSmartPrompt] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [form, setForm] = useState<NewTaskForm>({
    title: "",
    action: ActionType.SHUTDOWN,
    frequency: Frequency.ONCE,
    activeDays: [],
    scheduleMode: ScheduleMode.RELATIVE,
    hours: 0,
    minutes: 5,
    days: 0,
    absoluteDate: new Date().toISOString().split("T")[0],
    absoluteTime: "12:00",
    notes: "",
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("scheduled_tasks_v2");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("scheduled_tasks_v2", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Partial<NewTaskForm> = {}) => {
    const data = { ...form, ...taskData } as NewTaskForm;

    const {
      title,
      action,
      frequency,
      activeDays,
      scheduleMode,
      hours,
      minutes,
      days,
      absoluteDate,
      absoluteTime,
      notes,
    } = data;

    let targetTime: number;
    if (scheduleMode === ScheduleMode.RELATIVE) {
      const now = Date.now();
      const delayMs =
        (days || 0) * 86400000 +
        (hours || 0) * 3600000 +
        (minutes || 0) * 60000;
      targetTime = now + delayMs;
    } else {
      targetTime = new Date(`${absoluteDate}T${absoluteTime}`).getTime();
    }

    // Logic to find the next valid day if Weekly is selected
    if (frequency === Frequency.WEEKLY && activeDays.length > 0) {
      const date = new Date(targetTime);
      let dayFound = false;
      // Try next 7 days to find one that is active
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(targetTime + i * 86400000);
        if (activeDays.includes(checkDate.getDay())) {
          targetTime = checkDate.getTime();
          dayFound = true;
          break;
        }
      }
    }

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                title: title || `${action} Task`,
                action,
                frequency,
                activeDays: frequency === Frequency.WEEKLY ? activeDays : [],
                scheduleMode,
                targetTime,
                notes,
              }
            : t
        )
      );
    } else {
      const newTask: ScheduledTask = {
        id: Math.random().toString(36).substr(2, 9),
        title: title || `${action} Task`,
        action,
        frequency,
        activeDays: frequency === Frequency.WEEKLY ? activeDays : [],
        scheduleMode,
        targetTime,
        createdAt: Date.now(),
        status: "pending",
        notes,
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      title: "",
      action: ActionType.SHUTDOWN,
      frequency: Frequency.ONCE,
      activeDays: [],
      scheduleMode: ScheduleMode.RELATIVE,
      hours: 0,
      minutes: 5,
      days: 0,
      absoluteDate: new Date().toISOString().split("T")[0],
      absoluteTime: "12:00",
      notes: "",
    });
    setSmartPrompt("");
    setEditingTaskId(null);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTask = (task: ScheduledTask) => {
    const dateObj = new Date(task.targetTime);
    setForm({
      title: task.title,
      action: task.action,
      frequency: task.frequency,
      activeDays: task.activeDays || [],
      scheduleMode: task.scheduleMode,
      hours: 0,
      minutes: 0,
      days: 0,
      absoluteDate: dateObj.toISOString().split("T")[0],
      absoluteTime: dateObj.toTimeString().split(" ")[0].substring(0, 5),
      notes: task.notes || "",
    });
    setEditingTaskId(task.id);
    setIsModalOpen(true);
  };

  const toggleDay = (day: number) => {
    setForm((prev) => ({
      ...prev,
      activeDays: prev.activeDays.includes(day)
        ? prev.activeDays.filter((d) => d !== day)
        : [...prev.activeDays, day],
    }));
  };

  const deleteAll = () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
    }
  };

  const handleSmartSchedule = async () => {
    if (!smartPrompt.trim()) return;
    setIsParsing(true);
    try {
      const result = await parseNaturalLanguageTask(smartPrompt);
      if (result) {
        // Result from Gemini might not have activeDays, default to today if weekly
        if (
          result.frequency === Frequency.WEEKLY &&
          (!result.activeDays || result.activeDays.length === 0)
        ) {
          result.activeDays = [new Date().getDay()];
        }
        addTask(result);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to parse your request. Try manually scheduling.");
    } finally {
      setIsParsing(false);
    }
  };

  const daysLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-zinc-700 pb-20">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
              <IconWrapper name="Clock" className="text-black" size={20} />
            </div>
            <h1 className="text-lg font-bold tracking-tight">
              Scheduler<span className="text-zinc-500">Pro</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
              v1.4.0
            </div>
            <button className="text-zinc-400 hover:text-white transition-colors">
              <IconWrapper name="Settings" size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">
              My Schedule
            </h2>
            <p className="text-zinc-400 text-lg">
              Manage system actions and reminders from one place.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            <IconWrapper name="Plus" size={20} />
            Create Task
          </button>
        </div>

        {/* Stats */}
        <DashboardStats
          total={tasks.length}
          upcoming={tasks.filter((t) => t.targetTime > Date.now()).length}
          completed={tasks.filter((t) => t.targetTime <= Date.now()).length}
        />

        {/* List Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Upcoming Operations
          </h3>
          {tasks.length > 0 && (
            <button
              onClick={deleteAll}
              className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <IconWrapper name="Trash2" size={12} />
              Clear All
            </button>
          )}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-3xl text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 text-zinc-600">
                <IconWrapper name="Inbox" size={32} />
              </div>
              <h4 className="text-xl font-bold text-zinc-300">
                No tasks scheduled
              </h4>
              <p className="text-zinc-500 mt-2 max-w-xs mx-auto">
                Start by creating a task using the "Create Task" button or the
                natural language bar.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onEdit={handleEditTask}
              />
            ))
          )}
        </div>
      </main>

      {/* Quick Action NLP Bar */}
      <div className="fixed bottom-8 left-0 right-0 z-40 px-6 pointer-events-none">
        <div className="max-w-xl mx-auto pointer-events-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-700 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center bg-zinc-900/90 border border-zinc-700/50 backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
              <div className="px-3 text-zinc-500">
                <IconWrapper name="Zap" size={18} />
              </div>
              <input
                type="text"
                value={smartPrompt}
                onChange={(e) => setSmartPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSmartSchedule()}
                placeholder="Try: 'Shut down in 3 hours' or 'Meeting at 4pm tomorrow'"
                className="flex-1 bg-transparent border-none outline-none text-sm py-2 placeholder:text-zinc-600"
              />
              <button
                onClick={handleSmartSchedule}
                disabled={isParsing || !smartPrompt.trim()}
                className={`p-2 rounded-lg transition-all ${isParsing ? "bg-zinc-800" : "bg-white text-black hover:bg-zinc-200"}`}
              >
                {isParsing ? (
                  <div className="animate-spin h-5 w-5 border-2 border-zinc-500 border-t-transparent rounded-full" />
                ) : (
                  <IconWrapper name="ArrowRight" size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation/Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-zinc-800/50">
              <div>
                <h3 className="text-2xl font-bold">
                  {editingTaskId ? "Update Task" : "New Task"}
                </h3>
                <p className="text-zinc-500 text-sm mt-1">
                  {editingTaskId
                    ? "Modify your scheduled operation."
                    : "Configure your scheduled operation."}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
              >
                <IconWrapper name="X" size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Nightly Shutdown"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              {/* Action & Frequency Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    Action
                  </label>
                  <select
                    value={form.action}
                    onChange={(e) =>
                      setForm({ ...form, action: e.target.value as ActionType })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 appearance-none"
                  >
                    <option value={ActionType.SHUTDOWN}>Shutdown</option>
                    <option value={ActionType.RESTART}>Restart</option>
                    <option value={ActionType.SLEEP}>Sleep</option>
                    <option value={ActionType.MEETING}>Meeting</option>
                    <option value={ActionType.REMINDER}>Reminder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    Frequency
                  </label>
                  <select
                    value={form.frequency}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        frequency: e.target.value as Frequency,
                      })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 appearance-none"
                  >
                    <option value={Frequency.ONCE}>Once</option>
                    <option value={Frequency.DAILY}>Daily</option>
                    <option value={Frequency.WEEKLY}>Weekly</option>
                  </select>
                </div>
              </div>

              {/* Day Picker for Weekly */}
              {form.frequency === Frequency.WEEKLY && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    Active Days
                  </label>
                  <div className="flex justify-between gap-1">
                    {daysLabels.map((label, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                          form.activeDays.includes(idx)
                            ? "bg-zinc-100 text-black border-zinc-100"
                            : "bg-black text-zinc-500 border-zinc-800 hover:border-zinc-600"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scheduling Mode Tabs */}
              <div className="flex bg-black p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, scheduleMode: ScheduleMode.RELATIVE })
                  }
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.scheduleMode === ScheduleMode.RELATIVE ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  Relative Delay
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, scheduleMode: ScheduleMode.ABSOLUTE })
                  }
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.scheduleMode === ScheduleMode.ABSOLUTE ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  Exact Time
                </button>
              </div>

              {/* Scheduling Details */}
              {form.scheduleMode === ScheduleMode.RELATIVE ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.days}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          days: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.hours}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hours: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      Minutes
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.minutes}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          minutes: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.absoluteDate}
                      onChange={(e) =>
                        setForm({ ...form, absoluteDate: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={form.absoluteTime}
                      onChange={(e) =>
                        setForm({ ...form, absoluteTime: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 resize-none"
                  placeholder="Additional context..."
                />
              </div>
            </div>

            <div className="p-8 bg-zinc-900/50 border-t border-zinc-800/50 flex gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-zinc-400 font-semibold hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => addTask({})}
                className="flex-[2] py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  form.frequency === Frequency.WEEKLY &&
                  form.activeDays.length === 0
                }
              >
                {editingTaskId ? "Update Schedule" : "Schedule Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
