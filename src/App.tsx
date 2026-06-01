import {
  AlertCircle,
  Battery,
  CalendarDays,
  ChevronRight,
  History as HistoryIcon,
  Inbox,
  LayoutDashboard,
  Play,
  Settings as SettingsIcon,
  Smartphone,
  Sparkles,
  Tablet,
  Wifi
} from 'lucide-react';
// Types & Mock Data
import { Medication, ScreenId, SymptomLog } from './types';
import { initialMedications, initialNotifications, initialSymptomLogs } from './mockData';
import { useCallback, useEffect, useRef, useState } from 'react';

import AddTreatmentScreen from './components/AddTreatmentScreen';
import CalendarScreen from './components/CalendarScreen';
import DashboardScreen from './components/DashboardScreen';
import GeneralSettingsScreen from './components/GeneralSettingsScreen';
import HistoryScreen from './components/HistoryScreen';
import MedicationAlarmScreen from './components/MedicationAlarmScreen';
import NotificationSettingsScreen from './components/NotificationSettingsScreen';
// Subcomponents
import OnboardingScreen from './components/OnboardingScreen';
import SummaryReportScreen from './components/SummaryReportScreen';
import SymptomsScreen from './components/SymptomsScreen';
import TreatmentDetailsScreen from './components/TreatmentDetailsScreen';

export default function App() {
  // Load states from localStorage, falling back to empty datasets [] so that tests are default-clean!
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medtrack-medications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    // Starts empty by default for clean user testing
    return [];
  });

  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>(() => {
    const saved = localStorage.getItem('medtrack-symptom-logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    // Starts empty by default for clean user testing
    return [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('medtrack-notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialNotifications;
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window === 'undefined' || typeof Notification === 'undefined') {
      return 'unsupported';
    }
    return Notification.permission;
  });
  const notificationCache = useRef<Set<string>>(new Set());

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('onboarding');
  
  const [selectedMedicationId, setSelectedMedicationId] = useState<string>(() => {
    const saved = localStorage.getItem('medtrack-medications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0].id;
        }
      } catch (e) {}
    }
    return '';
  });

  // Ensure that when navigating to treatment details we have a valid medication id
  useEffect(() => {
    if (currentScreen === 'treatment_details') {
      const exists = medications.find((m) => m.id === selectedMedicationId);
      if (!exists) {
        const fallback = medications.find((m) => m.status === 'active') || medications[0];
        if (fallback) {
          console.warn('selectedMedicationId invalid or missing; defaulting to', fallback.id);
          setSelectedMedicationId(fallback.id);
        }
      }
    }
  }, [currentScreen, selectedMedicationId, medications]);

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastAlarmTime, setLastAlarmTime] = useState<string>('16:00');

  // Synchronize to localStorage whenever states change
  useEffect(() => {
    localStorage.setItem('medtrack-medications', JSON.stringify(medications));
    if (medications.length > 0 && !selectedMedicationId) {
      setSelectedMedicationId(medications[0].id);
    }
  }, [medications, selectedMedicationId]);

  useEffect(() => {
    localStorage.setItem('medtrack-symptom-logs', JSON.stringify(symptomLogs));
  }, [symptomLogs]);

  useEffect(() => {
    localStorage.setItem('medtrack-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof Notification === 'undefined') {
      setNotificationPermission('unsupported');
      return;
    }
    setNotificationPermission(Notification.permission);
  }, []);

  const requestNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
    if (typeof window === 'undefined' || typeof Notification === 'undefined') {
      setNotificationPermission('unsupported');
      triggerToast('Seu navegador não suporta notificações.');
      return 'unsupported';
    }

    let permission = Notification.permission;
    if (permission === 'default') {
      try {
        permission = await Notification.requestPermission();
      } catch (error) {
        permission = 'denied';
      }
    }

    setNotificationPermission(permission);
    if (permission === 'granted') {
      triggerToast('Permissão de notificações concedida. Avisos serão exibidos em breve.');
    } else {
      triggerToast('Permissão de notificações não concedida. Ative nas configurações do navegador se desejar.');
    }

    return permission;
  };

  const sendNotification = useCallback(
    (title: string, options: NotificationOptions) => {
      if (notificationPermission !== 'granted' || typeof window === 'undefined' || typeof Notification === 'undefined') {
        return;
      }

      try {
        new Notification(title, options);
      } catch (error) {
        console.warn('Falha ao enviar notificação:', error);
      }
    },
    [notificationPermission]
  );

  useEffect(() => {
    if (notificationPermission !== 'granted' || !notifications.enabled || medications.length === 0) {
      return;
    }

    const sendMedicationNotifications = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const currentDateKey = now.toISOString().split('T')[0];

      medications
        .filter((med) => med.status === 'active' && med.times.length > 0)
        .forEach((med) => {
          med.times.forEach((time) => {
            const [hours, minutes] = time.split(':').map(Number);
            if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;

            const doseMinutes = hours * 60 + minutes;
            const remindMinutes = notifications.remindBefore ? doseMinutes - 10 : doseMinutes;
            if (remindMinutes < 0) return;

            const notificationType = notifications.remindBefore ? 'reminder' : 'due';
            const key = `${med.id}-${time}-${currentDateKey}-${notificationType}`;
            if (notificationCache.current.has(key)) return;

            if (currentMinutes === remindMinutes) {
              const title = notifications.remindBefore
                ? `Lembrete: dose de ${med.name} em breve`
                : `Hora da dose de ${med.name}`;
              const body = notifications.remindBefore
                ? `Dose programada para ${time}. Prepare-se.`
                : `Tomar ${med.dosage} agora.`;

              const notificationOptions = {
                body,
                tag: key,
                ...(notifications.soundAndVibrate ? { vibrate: [200, 100, 200] } : {}),
              } as NotificationOptions;
              sendNotification(title, notificationOptions);
              notificationCache.current.add(key);
            }
          });
        });
    };

    sendMedicationNotifications();
    const interval = window.setInterval(sendMedicationNotifications, 15000);
    return () => window.clearInterval(interval);
  }, [medications, notifications.enabled, notifications.remindBefore, notifications.soundAndVibrate, notificationPermission, sendNotification]);

  // Method to purge all user data for clean test cycles
  const handleClearAllData = () => {
    setMedications([]);
    setSymptomLogs([]);
    setSelectedMedicationId('');
    localStorage.setItem('medtrack-medications', JSON.stringify([]));
    localStorage.setItem('medtrack-symptom-logs', JSON.stringify([]));
    triggerToast('Aplicativo resetado com sucesso! Iniciando testes do zero.');
  };

  // Method to reload mock scenario datasets for product walkthroughs
  const handleLoadDemoData = () => {
    setMedications(initialMedications);
    setSymptomLogs(initialSymptomLogs);
    if (initialMedications.length > 0) {
      setSelectedMedicationId(initialMedications[0].id);
    }
    localStorage.setItem('medtrack-medications', JSON.stringify(initialMedications));
    localStorage.setItem('medtrack-symptom-logs', JSON.stringify(initialSymptomLogs));
    triggerToast('Dados de demonstração restaurados! Você pode testá-los à vontade.');
  };

  // Helper trigger to display custom overlay toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // State Handler: Taken Dose event
  const handleTakeDose = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const nextTaken = Math.min(med.takenDoses + 1, med.totalDoses);
          if (nextTaken === med.totalDoses) {
            triggerToast(`Parabéns! Tratamento com ${med.name} concluído com sucesso! 🎉`);
            return { ...med, takenDoses: nextTaken, status: 'completed' as const };
          }
          triggerToast(`Dose de ${med.name} marcada como tomada! Progresso atualizado.`);
          return { ...med, takenDoses: nextTaken };
        }
        return med;
      })
    );
  };

  // State Handler: Record alarm / warning event
  const handleRecordDoseEvent = (medId: string, status: 'taken' | 'skipped', notes: string) => {
    if (status === 'taken') {
      handleTakeDose(medId);
    } else {
      setMedications((prev) =>
        prev.map((med) => {
          if (med.id === medId) {
            triggerToast(`Dose de ${med.name} pulada conforme solicitado.`);
            return { ...med, skippedDoses: med.skippedDoses + 1 };
          }
          return med;
        })
      );
    }

    if (notes.trim()) {
      const newLog: SymptomLog = {
        id: Math.random().toString(),
        symptom: 'Mal-estar / Efeitos',
        intensity: 2,
        notes: `Registrado no alarme: ${notes}`,
        timestamp: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setSymptomLogs((prev) => [newLog, ...prev]);
    }
  };

  // State Handler: Add new treatment
  const handleAddMedication = (newMed: Medication) => {
    setMedications((prev) => {
      // If same name exists, overwrite it, otherwise insert
      const filtered = prev.filter((m) => m.id !== newMed.id);
      return [newMed, ...filtered];
    });
    triggerToast(`Tratamento de ${newMed.name} iniciado e agendado com sucesso! 🔔`);
  };

  // State Handler: Interrupted treatment
  const handleEndTreatment = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          triggerToast(`Tratamento de ${med.name} foi encerrado.`);
          return { ...med, status: 'interrupted' as const };
        }
        return med;
      })
    );
  };

  // State Handler: Add symptom entry
  const handleAddSymptomLog = (log: SymptomLog) => {
    setSymptomLogs((prev) => [log, ...prev]);
    triggerToast(`Sintoma "${log.symptom}" (Intensidade: ${log.intensity}) registrado!`);
  };

  // Render correct subscreen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onNavigate={setCurrentScreen} />;
      case 'dashboard':
        return (
          <DashboardScreen
            medications={medications}
            onNavigate={setCurrentScreen}
            onTakeDose={handleTakeDose}
            onSkipDose={(id) => {
              setMedications((prev) =>
                prev.map((med) => (med.id === id ? { ...med, skippedDoses: med.skippedDoses + 1 } : med))
              );
              triggerToast('Dose pulada.');
            }}
            onSelectMedication={setSelectedMedicationId}
            lastAlarmTime={lastAlarmTime}
          />
        );
      case 'add_treatment':
        return <AddTreatmentScreen onAddMedication={handleAddMedication} onNavigate={setCurrentScreen} />;
      case 'medication_alarm':
        return (
          <MedicationAlarmScreen
            onNavigate={setCurrentScreen}
            onRecordDoseEvent={handleRecordDoseEvent}
          />
        );
      case 'calendar':
        return (
          <CalendarScreen medications={medications} onNavigate={setCurrentScreen} onTakeDose={handleTakeDose} />
        );
      case 'history':
        return (
          <HistoryScreen
            medications={medications}
            onNavigate={setCurrentScreen}
            onSelectMedication={setSelectedMedicationId}
          />
        );
      case 'treatment_details':
        return (
          <TreatmentDetailsScreen
            medicationId={selectedMedicationId}
            medications={medications}
            onNavigate={setCurrentScreen}
            onTakeDose={handleTakeDose}
            onEndTreatment={handleEndTreatment}
          />
        );
      case 'symptoms':
        return (
          <SymptomsScreen
            symptomLogs={symptomLogs}
            onNavigate={setCurrentScreen}
            onAddSymptomLog={handleAddSymptomLog}
          />
        );
      case 'summary_report':
        return (
          <SummaryReportScreen
            medicationId={selectedMedicationId}
            medications={medications}
            symptomLogs={symptomLogs}
            onNavigate={setCurrentScreen}
          />
        );
      case 'notification_settings':
        return (
          <NotificationSettingsScreen
            notifications={notifications}
            notificationPermission={notificationPermission}
            onRequestNotificationPermission={requestNotificationPermission}
            onUpdateNotifications={setNotifications}
            onNavigate={setCurrentScreen}
          />
        );
      case 'general_settings':
        return (
          <GeneralSettingsScreen
            onNavigate={setCurrentScreen}
            darkMode={darkMode}
            onToggleDarkMode={() => {
              setDarkMode(!darkMode);
              triggerToast(darkMode ? 'Modo claro ativado!' : 'Modo escuro ativado!');
            }}
            onClearAllData={handleClearAllData}
            onLoadDemoData={handleLoadDemoData}
          />
        );
      default:
        return <OnboardingScreen onNavigate={setCurrentScreen} />;
    }
  };

  // Nav items helper
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendário', icon: CalendarDays },
    { id: 'history', label: 'Histórico', icon: HistoryIcon },
    { id: 'general_settings', label: 'Ajustes', icon: SettingsIcon },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0b0f11] text-on-background dark' : 'bg-gray-100 text-gray-800'}`}>
      
      {/* Background ambient decorative blurs */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-screen filter blur-3xl opacity-30 pointer-events-none -z-10"></div>

      {/* Main Container Workspace layout */}
      <div className="w-full flex flex-col items-center justify-center min-h-screen p-4">
        {/* Interactive Smartphone Shell Frame */}
        <section className="w-full flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[390px] aspect-[9/19.5] min-h-[740px] max-h-[844px] bg-background rounded-[48px] overflow-hidden border-[8px] border-surface-bright shadow-2xl ring-1 ring-white/10 flex flex-col select-none mobile-device">
            
            {/* Top Smartphone notch / dynamic island layout */}
            <div className="absolute top-0 inset-x-0 h-7 bg-[#0b0f11] flex justify-between items-center px-6 z-[100] text-on-surface text-[11px] font-sans font-semibold pointer-events-none">
              <span className="tracking-tight text-white select-none">10:30</span>
              
              {/* Dynamic island bezel */}
              <div className="w-24 h-4.5 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1.5"></div>
              
              <div className="flex items-center gap-1.5 text-white">
                <Wifi className="w-3.5 h-3.5" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] select-none font-bold">LTE</span>
                  <Battery className="w-4 h-4 text-primary fill-primary" />
                </div>
              </div>
            </div>

            {/* Simulated interactive popups/toasts */}
            {toastMessage && (
              <div className="absolute top-9 left-4 right-4 bg-primary-container text-on-primary-container p-3 rounded-2xl shadow-2xl border border-primary/20 z-[200] flex items-center gap-2.5 text-xs font-semibold animate-fade-in-up">
                <Sparkles className="w-4 h-4 shrink-0 text-on-primary-fixed" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Immersive core viewport container */}
            <div className="flex-1 flex flex-col pt-7 pb-20 relative overflow-hidden bg-background">
              {renderScreen()}
            </div>

            {/* Bottom Smartphone safe indicators & Navigation tabs */}
            {/* Hide tabs on onboarding or alarm to align with specification */}
            {currentScreen !== 'onboarding' && currentScreen !== 'medication_alarm' && (
              <nav className="absolute bottom-0 left-0 right-0 h-20 bg-surface-container flex justify-around items-center px-4 z-[90] pb-2 border-t border-outline-variant/10">
                {tabs.map((tab) => {
                  const isActive =
                    currentScreen === tab.id ||
                    (tab.id === 'history' && currentScreen === 'treatment_details') ||
                    (tab.id === 'history' && currentScreen === 'summary_report');
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentScreen(tab.id as ScreenId)}
                      className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container font-black shadow-md scale-105'
                          : 'text-on-surface-variant hover:text-on-surface hover:scale-102'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="font-sans text-[10px] font-bold tracking-wider">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Smartphone native bottom bar pill pointer */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-[100] pointer-events-none"></div>
          </div>
        </section>

      </div>
    </div>
  );
}
