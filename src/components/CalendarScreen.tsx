import { AlertCircle, Bell, Calendar as CalendarIcon, CheckCircle, ChevronDown, Clock } from 'lucide-react';
import { Medication, ScreenId } from '../types';
import React, { useState } from 'react';

interface CalendarScreenProps {
  medications: Medication[];
  onNavigate: (screen: ScreenId) => void;
  onTakeDose: (id: string) => void;
}

export default function CalendarScreen({ medications, onNavigate, onTakeDose }: CalendarScreenProps) {
  const today = new Date();
  const monthName = today
    .toLocaleString('pt-BR', { month: 'long' })
    .replace(/^./, (char) => char.toUpperCase());

  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Sample static status values that simulate dose scheduling for selected calendar day
  const [isDose1600Taken, setIsDose1600Taken] = useState(false);

  // Active medication (usually Amoxicilina) used in lists
  const activeMed = medications.find((med) => med.status === 'active') || medications[0];
  const medicationTimes = activeMed?.times?.length
    ? activeMed.times
    : ['08:00', '16:00', '00:00'];
  const [firstDoseTime, secondDoseTime, thirdDoseTime] = medicationTimes;

  const days = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index - 2);
    const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    return { num: date.getDate(), name: weekdayNames[date.getDay()] };
  });

  return (
    <div className="flex-grow flex flex-col p-6 pb-28 text-on-surface animate-fade-in-up no-scrollbar overflow-y-auto">
      {/* Calendar Header with Dropdown */}
      <section className="mb-6 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">{monthName}</h2>
          <button className="flex items-center gap-1.5 font-sans text-xs font-bold text-primary bg-surface-container px-3.5 py-2.5 rounded-full border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer shadow-sm">
            Todos os tratamentos
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Days Scrollable snapping list */}
        <div className="flex overflow-x-auto gap-2.5 pb-2 no-scrollbar snap-x">
          {days.map((day) => (
            <button
              key={day.num}
              onClick={() => setSelectedDay(day.num)}
              className={`flex flex-col items-center justify-center min-w-[64px] py-3.5 rounded-2xl border transition-all cursor-pointer snap-start ${
                selectedDay === day.num
                  ? 'bg-primary text-on-primary border-primary font-bold shadow-[0_4px_15px_rgba(161,201,255,0.25)]'
                  : 'bg-surface-container border-outline-variant/35 text-on-surface-variant hover:border-outline'
              }`}
            >
              <span className="font-sans text-[10px] uppercase tracking-wider opacity-85 font-semibold">
                {day.name}
              </span>
              <span className="font-headline text-lg mt-1">{day.num}</span>
              {selectedDay === day.num && (
                <div className="w-1.5 h-1.5 bg-on-primary rounded-full mt-1.5 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Dose Timing Cards list representing selected day list items */}
      <div className="flex flex-col gap-4 relative">
        {medications.length > 0 ? (
          <>
            <div className="absolute left-[24px] top-4 bottom-4 w-[2px] bg-surface-container-highest z-0 rounded-full hidden md:block"></div>

            {/* Dose 08:00 (Taken status) */}
            <article className="relative z-10 flex flex-col gap-3 bg-surface-container p-4 rounded-2xl shadow-md border border-surface-container-highest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle className="w-5 h-5 text-secondary fill-secondary-container" />
                </div>
                
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start w-full">
                    <h3 className="font-headline text-md font-bold text-on-surface">{activeMed?.name || 'Medicamento'}</h3>
                    <span className="font-headline text-md font-bold text-on-surface-variant">{firstDoseTime}</span>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">
                    {activeMed?.dosage || ''} • {activeMed?.category || 'Comprimido'}
                  </p>
                  
                  <div className="mt-3 self-start">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-sans text-[10px] font-bold tracking-wide uppercase border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5"></span>
                      Tomado
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Dose 16:00 (Pendente/Actionable status) */}
            {!isDose1600Taken ? (
              <article className="relative z-10 flex flex-col gap-3 bg-surface-container p-4 rounded-2xl shadow-md border-l-4 border-l-tertiary border border-surface-container-highest">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center shadow-md animate-pulse">
                    <AlertCircle className="w-5 h-5 text-tertiary" />
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start w-full">
                      <h3 className="font-headline text-md font-bold text-on-surface">{activeMed?.name || 'Medicamento'}</h3>
                      <span className="font-headline text-md font-bold text-on-surface-variant opacity-70">{secondDoseTime}</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant mt-1">
                      {activeMed?.dosage || ''} • {activeMed?.category || 'Comprimido'}
                    </p>
                    
                    <div className="mt-3 self-start">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-tertiary-container text-on-tertiary-container font-sans text-[10px] font-bold tracking-wide uppercase border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1.5"></span>
                        Pendente
                      </span>
                    </div>

                    {/* Quick actions for Pending dose */}
                    <div className="mt-4 flex gap-3 w-full">
                      <button
                        onClick={() => {
                          setIsDose1600Taken(true);
                          if (activeMed) onTakeDose(activeMed.id);
                        }}
                        className="flex-1 min-h-[44px] bg-primary text-on-primary font-sans text-xs font-bold rounded-xl shadow-md hover:bg-primary/90 transition-colors cursor-pointer active:scale-[0.98]"
                      >
                        Registrar
                      </button>
                      <button
                        onClick={() => setIsDose1600Taken(true)} // Skips/removes alert
                        className="flex-1 min-h-[44px] bg-surface-container-high border border-outline-variant text-on-surface font-sans text-xs font-bold rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer"
                      >
                        Adiar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              // Rendered as taken after clicking registrar
              <article className="relative z-10 flex flex-col gap-3 bg-surface-container p-4 rounded-2xl shadow-md border border-surface-container-highest animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle className="w-5 h-5 text-secondary fill-secondary-container" />
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start w-full">
                      <h3 className="font-headline text-md font-bold text-on-surface">{activeMed?.name || 'Medicamento'}</h3>
                      <span className="font-headline text-md font-bold text-on-surface-variant opacity-70">{secondDoseTime}</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant mt-1">
                      {activeMed?.dosage || ''} • {activeMed?.category || 'Comprimido'}
                    </p>
                    <div className="mt-3 self-start">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-sans text-[10px] font-bold tracking-wide uppercase border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5"></span>
                        Tomado
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Dose 00:00 (Next scheduled dose status) */}
            <article className="relative z-10 flex flex-col gap-3 bg-surface-container p-4 rounded-2xl shadow-md border border-surface-container-highest opacity-85">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 bg-primary-container/20 text-primary flex items-center justify-center shadow-md">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start w-full">
                    <h3 className="font-headline text-md font-bold text-on-surface">{activeMed?.name || 'Medicamento'}</h3>
                    <span className="font-headline text-md font-bold text-on-surface-variant">{thirdDoseTime}</span>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">
                    {activeMed?.dosage || ''} • {activeMed?.category || 'Comprimido'}
                  </p>
                  
                  <div className="mt-3 self-start">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary-fixed/20 text-primary font-sans text-[10px] font-bold tracking-wide uppercase border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span>
                      Próxima dose
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </>
        ) : (
          /* Sleek Empty State for Calendar inside Usability tests */
          <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/15 shadow-xl flex flex-col items-center text-center py-12 gap-5 animate-fade-in-up mt-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
              <CalendarIcon className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-headline text-md font-bold text-on-surface">Sem agendamentos</h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed max-w-[260px] mx-auto">
                Cadastre seus medicamentos e tratamentos para ver os horários das doses distribuídos na agenda do calendário.
              </p>
            </div>

            <button
              onClick={() => onNavigate('add_treatment')}
              className="mt-2 w-full max-w-[240px] min-h-[48px] bg-primary text-on-primary font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary/95 transition-colors cursor-pointer active:scale-98 shadow-md"
            >
              Adicionar Tratamento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
