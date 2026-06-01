import { Medication, SymptomLog, NotificationSettings } from './types';

export const initialMedications: Medication[] = [
  {
    id: 'amoxicilina',
    name: 'Amoxicilina',
    dosage: '1 cápsula (500mg)',
    category: 'Antibiótico',
    frequency: 'A cada 8 horas',
    period: '18 Out - 24 Out',
    durationDays: 7,
    totalDoses: 21,
    takenDoses: 15,
    skippedDoses: 0,
    missedDoses: 0,
    status: 'active',
    requirements: ['Tomar com água', 'Tomar com alimento', 'Evitar álcool'],
    times: ['08:00', '16:00', '00:00']
  },
  {
    id: 'clindamicina',
    name: 'Clindamicina',
    dosage: '1 cápsula',
    category: 'Antibiótico',
    frequency: 'A cada 8 horas',
    period: '01 Out - 08 Out',
    durationDays: 7,
    totalDoses: 21,
    takenDoses: 21,
    skippedDoses: 0,
    missedDoses: 0,
    status: 'completed',
    requirements: ['Tomar com água', 'Tomar com alimento', 'Evitar álcool'],
    times: ['08:00', '16:00', '00:00']
  },
  {
    id: 'antitetrmico',
    name: 'Antitérmico',
    dosage: '20 gotas',
    category: 'Analgésico',
    frequency: 'Se necessário',
    period: '20 Set - 22 Set',
    durationDays: 3,
    totalDoses: 9,
    takenDoses: 6,
    skippedDoses: 2,
    missedDoses: 1,
    status: 'interrupted',
    requirements: ['Diluir em água'],
    times: ['12:00', '20:00']
  }
];

export const initialSymptomLogs: SymptomLog[] = [
  {
    id: 'log1',
    symptom: 'Febre',
    intensity: 6,
    notes: 'Febre moderada a forte pela manhã.',
    timestamp: 'Hoje, 08:00',
    medicationTaken: 'Tomou Tylenol'
  },
  {
    id: 'log2',
    symptom: 'Dor de cabeça',
    intensity: 3,
    notes: 'Dor de cabeça leve no fim do dia.',
    timestamp: 'Ontem, 20:15'
  }
];

export const initialNotifications: NotificationSettings = {
  enabled: true,
  remindBefore: false,
  repeatAlert: true,
  soundAndVibrate: true
};
