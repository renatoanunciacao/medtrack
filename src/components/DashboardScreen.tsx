import { AlarmClock, Bell, CheckCircle, Heart, History, Pill, Plus } from 'lucide-react';
import { Medication, ScreenId } from '../types';

interface DashboardScreenProps {
  medications: Medication[];
  onNavigate: (screen: ScreenId) => void;
  onTakeDose: (id: string) => void;
  onSkipDose: (id: string) => void;
  onSelectMedication: (id: string) => void;
  lastAlarmTime: string;
}

export default function DashboardScreen({
  medications,
  onNavigate,
  onTakeDose,
  onSkipDose,
  onSelectMedication,
  lastAlarmTime,
}: DashboardScreenProps) {
  // Find currently active primary medication (Amoxicilina or Clindamicina if active)
  const activeMed = medications.find((med) => med.status === 'active') || medications[0];

  const parseTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return Number.isFinite(hours) && Number.isFinite(minutes) ? hours * 60 + minutes : 0;
  };

  const sortedTimes = activeMed?.times?.length
    ? [...activeMed.times].sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b))
    : [];

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const upcomingToday = activeMed
    ? sortedTimes
        .filter((time) => parseTimeToMinutes(time) >= nowMinutes)
        .map((time) => ({ time, name: activeMed.name }))
    : [];

  if (activeMed && upcomingToday.length === 0 && sortedTimes.length > 0) {
    upcomingToday.push({ time: sortedTimes[0], name: activeMed.name });
  }

  const progressPercent = activeMed
    ? Math.round((activeMed.takenDoses / activeMed.totalDoses) * 100)
    : 70;

  return (
    <div className="flex-1 flex flex-col p-6 text-on-surface animate-fade-in-up">
      {/* Top Header Row representing the native application top bar */}
      <header className="flex justify-between items-center h-16 border-b border-surface-container-highest/30 mb-6">
        <button
          onClick={() => onNavigate('symptoms')}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors cursor-pointer text-primary"
          title="Sintomas"
        >
          <Heart className="w-6 h-6 fill-primary/10" />
        </button>
        <h1 className="font-headline text-lg font-extrabold text-primary tracking-wide">MedTrack</h1>
        <button
          onClick={() => onNavigate('notification_settings')}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors cursor-pointer text-primary"
          title="Configurações de Notificações"
        >
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Scroll Container */}
      <div className="flex-1 flex flex-col gap-6 no-scrollbar overflow-y-auto">
        {/* Hello & Status Tracker Section */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface">Olá, Usuário!</h2>
            {medications.length > 0 && (
              <div
                onClick={() => onNavigate('medication_alarm')}
                className="px-2 py-1 bg-primary/20 text-primary-fixed-dim rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/20 flex items-center gap-1 cursor-pointer animate-pulse-slow"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Alarme Simulado
              </div>
            )}
          </div>
          {medications.length > 0 ? (
            <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full self-start text-xs font-semibold shadow-sm border border-white/5">
              <AlarmClock className="w-3.5 h-3.5" />
              <span>Próxima dose às {lastAlarmTime}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-full self-start text-xs font-semibold shadow-sm border border-white/5">
              <AlarmClock className="w-3.5 h-3.5 text-primary" />
              <span>Pronto para iniciar tratamentos</span>
            </div>
          )}
        </section>

        {medications.length > 0 ? (
          <>
            {/* Primary Treatment Alert Card */}
            {activeMed && (
              <section className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 shadow-xl relative overflow-hidden flex flex-col gap-4">
                {/* Top Row with Pill Icon and Header */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-inner">
                      <Pill className="w-6 h-6 text-on-primary-fixed" />
                    </div>
                    <div className="flex flex-col">
                      <h3
                        onClick={() => {
                          onSelectMedication(activeMed.id);
                          onNavigate('treatment_details');
                        }}
                        className="font-headline text-lg font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
                      >
                        {activeMed.name}
                      </h3>
                      <p className="font-sans text-xs text-on-surface-variant font-medium">{activeMed.dosage}</p>
                    </div>
                  </div>
                  <div className="bg-surface-container text-on-surface-variant font-sans text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/5">
                    {activeMed.frequency}
                  </div>
                </div>

                {/* Progress Area */}
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-primary font-semibold">
                      {activeMed.takenDoses} de {activeMed.totalDoses} doses
                    </span>
                    <span className="text-on-surface-variant font-medium">
                      {activeMed.durationDays} dias no total
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-right text-on-surface-variant font-semibold">
                    {progressPercent}% concluído
                  </span>
                </div>

                {/* Dose Interactive Actions Container */}
                <div className="flex flex-col gap-2 mt-1">
                  <button
                    onClick={() => onTakeDose(activeMed.id)}
                    className="w-full min-h-[50px] bg-primary text-on-primary rounded-xl font-sans text-sm font-bold flex justify-center items-center gap-2 active:scale-[0.98] transition-all hover:bg-primary/95 cursor-pointer shadow-md shadow-primary/10"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Tomei agora
                  </button>
                  <button
                    onClick={() => onSkipDose(activeMed.id)}
                    className="w-full min-h-[40px] text-on-surface-variant text-xs font-semibold flex justify-center items-center active:bg-surface-container rounded-lg transition-colors hover:text-error"
                  >
                    Pular dose
                  </button>
                </div>
              </section>
            )}

            {/* Upcoming Medication Queue block */}
            {upcomingToday.length > 0 && (
              <section className="flex flex-col gap-3">
                <h3 className="font-headline text-base font-bold text-on-surface tracking-tight">Próximas doses hoje</h3>
                <div className="flex flex-col gap-2">
                  {upcomingToday.map((dose, idx) => (
                    <div
                      key={idx}
                      onClick={() => onNavigate('calendar')}
                      className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/10 hover:border-primary/20 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:bg-primary/15 group-hover:text-primary transition-all">
                        <AlarmClock className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <span className="font-sans text-xs font-bold text-on-surface">{dose.time}</span>
                        <span className="font-sans text-xs text-on-surface-variant">{dose.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* Sleek Empty State Card for Usability testing of clean accounts */
          <section className="bg-surface-container rounded-3xl p-6 border border-outline-variant/15 shadow-xl flex flex-col items-center text-center py-12 gap-5 animate-fade-in-up">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
              <Pill className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-headline text-md font-bold text-on-surface">Nenhum tratamento ativo</h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed max-w-[260px] mx-auto">
                Tire foto de uma receita médica ou cadastre um medicamento manualmente para organizar seus horários e receber lembretes em tempo real.
              </p>
            </div>

            <button
              onClick={() => onNavigate('add_treatment')}
              className="mt-2 w-full max-w-[240px] min-h-[48px] bg-primary text-on-primary font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors cursor-pointer active:scale-98 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Adicionar Tratamento
            </button>
          </section>
        )}

        {/* Quick Treatment Actions Grid */}
        <section className="flex gap-4">
          <button
            onClick={() => onNavigate('add_treatment')}
            className="flex-1 min-h-[56px] bg-primary-container text-on-primary-container rounded-xl font-sans text-xs font-bold flex flex-col justify-center items-center gap-1 active:scale-[0.98] transition-transform shadow-md cursor-pointer hover:bg-primary-container/90"
          >
            <Plus className="w-5 h-5 text-on-primary-fixed" />
            Novo Tratamento
          </button>
          <button
            onClick={() => {
              onSelectMedication(activeMed?.id || '');
              onNavigate('history');
            }}
            className="flex-1 min-h-[56px] bg-surface-container-low border border-outline-variant text-on-surface rounded-xl font-sans text-xs font-bold flex flex-col justify-center items-center gap-1 active:scale-[0.98] transition-transform hover:bg-surface-container-high cursor-pointer"
          >
            <History className="w-5 h-5 text-primary" />
            Ver Histórico
          </button>
        </section>
      </div>
    </div>
  );
}
