export interface Medication {
  id: string;
  name: string;
  dosage: string;
  category: string;
  frequency: string;
  period: string;
  durationDays: number;
  totalDoses: number;
  takenDoses: number;
  skippedDoses: number;
  missedDoses: number;
  status: 'active' | 'completed' | 'interrupted';
  requirements: string[]; // e.g., ["Tomar com água", "Tomar com alimento", "Evitar álcool"]
  times: string[]; // e.g., ["08:00", "16:00", "00:00"]
}

export interface SymptomLog {
  id: string;
  symptom: string;
  intensity: number;
  notes: string;
  timestamp: string;
  medicationTaken?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  remindBefore: boolean;
  repeatAlert: boolean;
  soundAndVibrate: boolean;
}

export type ScreenId =
  | 'onboarding'
  | 'dashboard'
  | 'add_treatment'
  | 'medication_alarm'
  | 'calendar'
  | 'history'
  | 'treatment_details'
  | 'symptoms'
  | 'summary_report'
  | 'notification_settings'
  | 'general_settings';
