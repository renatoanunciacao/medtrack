import { ArrowLeft, Bell, Clock, RotateCw, ShieldAlert, Volume2 } from 'lucide-react';
import { NotificationSettings, ScreenId } from '../types';
import React, { useEffect, useState } from 'react';

interface NotificationSettingsScreenProps {
  notifications: NotificationSettings;
  notificationPermission: NotificationPermission | 'unsupported';
  onRequestNotificationPermission: () => Promise<NotificationPermission | 'unsupported'>;
  onUpdateNotifications: (settings: NotificationSettings) => void;
  onNavigate: (screen: ScreenId) => void;
}

export default function NotificationSettingsScreen({
  notifications,
  notificationPermission,
  onRequestNotificationPermission,
  onUpdateNotifications,
  onNavigate,
}: NotificationSettingsScreenProps) {
  const [enabled, setEnabled] = useState(notifications.enabled);
  const [remindBefore, setRemindBefore] = useState(notifications.remindBefore);
  const [repeatAlert, setRepeatAlert] = useState(notifications.repeatAlert);
  const [soundAndVibrate, setSoundAndVibrate] = useState(notifications.soundAndVibrate);

  useEffect(() => {
    setEnabled(notifications.enabled);
    setRemindBefore(notifications.remindBefore);
    setRepeatAlert(notifications.repeatAlert);
    setSoundAndVibrate(notifications.soundAndVibrate);
  }, [notifications]);

  const handleToggle = (setting: 'enabled' | 'remindBefore' | 'repeatAlert' | 'soundAndVibrate') => {
    let nextEnabled = enabled;
    let nextRemindBefore = remindBefore;
    let nextRepeatAlert = repeatAlert;
    let nextSoundAndVibrate = soundAndVibrate;

    if (setting === 'enabled') {
      if (!enabled) {
        onRequestNotificationPermission().then((permission) => {
          const granted = permission === 'granted';
          setEnabled(granted);
          onUpdateNotifications({
            enabled: granted,
            remindBefore: nextRemindBefore,
            repeatAlert: nextRepeatAlert,
            soundAndVibrate: nextSoundAndVibrate,
          });
        });
        return;
      }
      nextEnabled = false;
      setEnabled(false);
    } else if (setting === 'remindBefore') {
      nextRemindBefore = !remindBefore;
      setRemindBefore(nextRemindBefore);
    } else if (setting === 'repeatAlert') {
      nextRepeatAlert = !repeatAlert;
      setRepeatAlert(nextRepeatAlert);
    } else if (setting === 'soundAndVibrate') {
      nextSoundAndVibrate = !soundAndVibrate;
      setSoundAndVibrate(nextSoundAndVibrate);
    }

    onUpdateNotifications({
      enabled: nextEnabled,
      remindBefore: nextRemindBefore,
      repeatAlert: nextRepeatAlert,
      soundAndVibrate: nextSoundAndVibrate,
    });
  };

  const permissionLabel =
    notificationPermission === 'granted'
      ? 'Concedida'
      : notificationPermission === 'denied'
      ? 'Negada'
      : notificationPermission === 'default'
      ? 'Pendente'
      : 'Não suportado';

  return (
    <div className="flex-grow flex flex-col p-6 pb-28 text-on-surface animate-fade-in-up no-scrollbar overflow-y-auto">
      {/* Top Application header */}
      <header className="flex justify-between items-center h-16 border-b border-surface-container-highest/20 mb-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-primary hover:bg-surface-container-high transition-colors duration-200 p-2 rounded-full flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <span className="font-headline text-md font-bold text-primary">Notificações</span>
        <div className="w-10"></div> {/* Balanced spacer */}
      </header>

      {/* Main Settings section */}
        <div className="mb-6 rounded-[24px] bg-surface-container p-4 border border-outline-variant/20 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] font-semibold text-on-surface-variant mb-1">
                  Permissão do navegador
                </p>
                <p className="font-headline text-sm font-bold text-on-surface">{permissionLabel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => await onRequestNotificationPermission()}
              className="rounded-full border border-primary/20 bg-primary-container px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-primary transition hover:bg-primary/10"
            >
              Solicitar permissão
            </button>
          </div>
          <p className="mt-3 text-[11px] text-on-surface-variant">
            Ative permissão de notificações para receber alertas reais do navegador sobre seus horários de dose.
          </p>
        </div>
      <section className="space-y-6 pt-2">
        <div className="mb-2">
          <h2 className="font-headline text-2xl font-black text-on-surface mb-2">Configurações de Alerta</h2>
          <p className="font-sans text-xs text-on-surface-variant font-medium">
            Gerencie como o MedTrack avisa sobre suas medicações.
          </p>
        </div>

        {/* Toggles Container */}
        <div className="bg-surface-container rounded-[20px] overflow-hidden border border-outline-variant/10 shadow-lg divide-y divide-surface-variant/40">
          {/* Toggle 1: Ativar notificações */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-bold text-on-surface">Ativar notificações</span>
                <span className="font-sans text-[10px] text-on-surface-variant font-semibold mt-0.5">
                  Permitir avisos gerais
                </span>
              </div>
            </div>
            
            {/* iOS style toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => handleToggle('enabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Toggle 2: Lembrar 10min antes */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-highest/60 text-on-surface-variant flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-bold text-on-surface">Lembrar 10min antes</span>
                <span className="font-sans text-[10px] text-on-surface-variant font-semibold mt-0.5">
                  Aviso antecipado da dose
                </span>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remindBefore}
                onChange={() => handleToggle('remindBefore')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Toggle 3: Repetir alerta */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
                <RotateCw className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-bold text-on-surface">Repetir alerta</span>
                <span className="font-sans text-[10px] text-on-surface-variant font-semibold mt-0.5">
                  A cada 5 minutos se ignorado
                </span>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={repeatAlert}
                onChange={() => handleToggle('repeatAlert')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Toggle 4: Som e Vibração */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-bold text-on-surface">Som e Vibração</span>
                <span className="font-sans text-[10px] text-on-surface-variant font-semibold mt-0.5">
                  Tocar som padrão do sistema
                </span>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={soundAndVibrate}
                onChange={() => handleToggle('soundAndVibrate')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Mock push notification preview */}
      {enabled && (
        <section className="mt-8 animate-fade-in-up">
          <h3 className="font-headline text-sm font-bold text-on-surface mb-3 uppercase tracking-wider opacity-85">
            Exemplo de Notificação
          </h3>
          <div className="bg-surface-container-high p-4 rounded-2xl border border-surface-variant/80 max-w-sm mx-auto shadow-2xl animate-pulse-slow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary rounded-full p-1.5 flex items-center justify-center text-on-primary">
                  <Bell className="w-3.5 h-3.5 text-on-primary fill-on-primary" />
                </div>
                <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  MedTrack
                </span>
              </div>
              <span className="font-sans text-[10px] text-on-surface-variant font-medium">Agora</span>
            </div>
            <h4 className="font-sans text-xs font-bold text-on-surface">Hora da sua dose!</h4>
            <p className="font-sans text-xs text-on-surface-variant mt-1">Clindamicina - 1 cápsula.</p>
          </div>
        </section>
      )}
    </div>
  );
}
