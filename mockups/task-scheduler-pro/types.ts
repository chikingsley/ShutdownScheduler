export enum ActionType {
  SHUTDOWN = "SHUTDOWN",
  RESTART = "RESTART",
  SLEEP = "SLEEP",
  MEETING = "MEETING",
  REMINDER = "REMINDER",
}

export enum Frequency {
  ONCE = "ONCE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
}

export enum ScheduleMode {
  RELATIVE = "RELATIVE",
  ABSOLUTE = "ABSOLUTE",
}

export interface ScheduledTask {
  id: string;
  title: string;
  action: ActionType;
  frequency: Frequency;
  activeDays?: number[]; // 0 for Sunday, 6 for Saturday
  scheduleMode: ScheduleMode;
  targetTime: number; // Timestamp of the next occurrence
  createdAt: number;
  status: "pending" | "completed" | "canceled";
  notes?: string;
}

export interface NewTaskForm {
  title: string;
  action: ActionType;
  frequency: Frequency;
  activeDays: number[];
  scheduleMode: ScheduleMode;
  hours: number;
  minutes: number;
  days: number;
  absoluteDate: string;
  absoluteTime: string;
  notes: string;
}
