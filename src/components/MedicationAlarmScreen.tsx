import React, { useState } from 'react';
import { Pill, Droplets, Utensils, Ban, Edit3, CheckCircle, Clock, FastForward, X } from 'lucide-react';
import { ScreenId } from '../types';

interface MedicationAlarmScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onRecordDoseEvent: (medId: string, status: 'taken' | 'skipped', notes: string) => void;
}

export default function MedicationAlarmScreen({
  onNavigate,
  onRecordDoseEvent,
}: MedicationAlarmScreenProps) {
  const [symptomNotes, setSymptomNotes] = useState('');

  const handleAction = (status: 'taken' | 'skipped') => {
    // Standard record to Clindamicina or active item
    onRecordDoseEvent('clindamicina', status, symptomNotes);
    onNavigate('dashboard');
  };

  return (
    <div className="flex-grow flex flex-col p-6 text-on-surface animate-fade-in-up relative no-scrollbar overflow-y-auto">
      {/* Top native bar headers */}
      <header className="flex justify-between items-center h-16 border-b border-surface-container-highest/30 mb-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="font-headline text-sm font-bold text-primary">Hora da Medicação</span>
        <div className="w-10"></div> {/* Balance spacer */}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Timer Due Context */}
        <div className="flex flex-col items-center justify-center text-center mb-6 pt-2">
          <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
            HORA DA MEDICAÇÃO
          </span>
          <h1 className="font-headline text-5xl font-black text-on-surface select-none tracking-tight">16:00</h1>
        </div>

        {/* Medication Bento Core Card */}
        <section className="bg-surface-container-lowest rounded-[24px] p-5 shadow-2xl border border-surface-container-highest/50 mb-4 relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 shadow-md">
              <Pill className="w-7 h-7 text-on-primary-fixed fill-on-primary-fixed" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-headline text-lg font-bold text-on-surface">Clindamicina</h2>
              <span className="font-sans text-xs text-on-surface-variant font-semibold mt-1">1 cápsula</span>
              <span className="font-sans text-[10px] font-bold text-primary mt-3 bg-primary-fixed/20 inline-flex items-center px-2.5 py-1 rounded-full w-fit tracking-wide uppercase">
                <Droplets className="w-3.5 h-3.5 mr-1" />
                Tomar com água
              </span>
            </div>
          </div>
        </section>

        {/* Directive Warnings Bento Block Grid */}
        <section className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-surface-container-high">
            <Utensils className="w-5 h-5 text-tertiary" />
            <span className="font-sans text-xs font-semibold text-on-surface-variant leading-tight">
              Tomar com alimento
            </span>
          </div>
          <div className="bg-error-container/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-error-container/40">
            <Ban className="w-5 h-5 text-error" />
            <span className="font-sans text-xs font-semibold text-error/90 leading-tight">
              Evitar álcool
            </span>
          </div>
        </section>

        {/* Extra symptoms inputs */}
        <section className="mb-6">
          <label className="block font-sans text-xs font-bold text-on-surface mb-2" htmlFor="feeling">
            Como você está se sentindo? <span className="text-on-surface-variant font-normal">(opcional)</span>
          </label>
          <div className="relative">
            <input
              id="feeling"
              type="text"
              value={symptomNotes}
              onChange={(e) => setSymptomNotes(e.target.value)}
              placeholder="Ex: Senti um de pouco enjoo..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-4 pr-12 py-3.5 font-sans text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-[56px]"
            />
            <Edit3 className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant" />
          </div>
        </section>

        {/* Action Bottom Handlers */}
        <section className="flex flex-col gap-3 w-full mt-auto">
          {/* Primary bold Green button */}
          <button
            onClick={() => handleAction('taken')}
            className="bg-primary hover:bg-primary/95 text-on-primary w-full min-h-[60px] rounded-xl flex items-center justify-center gap-2 font-headline text-md font-bold shadow-lg shadow-primary/15 transition-all active:scale-[0.98] cursor-pointer"
          >
            <CheckCircle className="w-5 h-5 fill-on-primary text-primary" />
            Tomei
          </button>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAction('taken')} // Snooze logs as taken but delays
              className="bg-surface-container text-on-surface w-full min-h-[50px] rounded-xl flex items-center justify-center gap-1.5 font-sans text-xs font-bold hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4 text-primary" />
              Adiar 15 min
            </button>
            <button
              onClick={() => handleAction('skipped')}
              className="bg-surface-bright border border-error/10 text-error w-full min-h-[50px] rounded-xl flex items-center justify-center gap-1.5 font-sans text-xs font-bold hover:bg-error-container/20 transition-all cursor-pointer"
            >
              <FastForward className="w-4 h-4 text-error" />
              Pular dose
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
