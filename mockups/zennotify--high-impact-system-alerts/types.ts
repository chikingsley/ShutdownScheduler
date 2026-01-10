export enum NotificationType {
  MEETING = "MEETING",
  SHUTDOWN = "SHUTDOWN",
  CUSTOM = "CUSTOM",
}

export interface Participant {
  initials: string;
  color: string;
}

export interface NotificationScenario {
  id: string;
  type: NotificationType;
  title: string;
  subtitle: string;
  timeRange?: string;
  platform?: string;
  participants?: Participant[];
  durationSeconds: number;
  aiContext: string;
  primaryAction: string;
  secondaryAction: string;
}

export interface AIResponse {
  briefing: string;
  urgencyLevel: "low" | "medium" | "high";
  encouragement: string;
}
