import { ArrowLeft, CalendarRange, CheckCircle2, Clipboard, Clock, Edit, Pill, Share2, ShieldAlert, Trash2 } from 'lucide-react';
import { Medication, ScreenId } from '../types';
import React, { useState } from 'react';

interface TreatmentDetailsScreenProps {
  medicationId: string;
  medications: Medication[];
  onNavigate: (screen: ScreenId) => void;
  onTakeDose: (id: string) => void;
  onEndTreatment: (id: string) => void;
}

export default function TreatmentDetailsScreen({
  medicationId,
  medications,
  onNavigate,
  onTakeDose,
  onEndTreatment,
}: TreatmentDetailsScreenProps) {
  // Find current selected medication
  const foundMed = medications.find((m) => m.id === medicationId);
  if (!foundMed && medicationId) {
    console.warn(`TreatmentDetails: medicationId '${medicationId}' not found in medications array`);
  }
  const currentMed = foundMed || medications[0];
  const [isDoseRecorded1600, setIsDoseRecorded1600] = useState(false);

  if (!currentMed) {
    return (
      <div className="p-6 text-center text-on-surface-variant pt-12">
        Medicamento não encontrado.
        <button onClick={() => onNavigate('dashboard')} className="mt-4 text-primary block mx-auto underline">
          Voltar para Home
        </button>
      </div>
    );
  }

  // Calculate percentage
  const adherencePercent = Math.round((currentMed.takenDoses / currentMed.totalDoses) * 100);

  return (
    <div className="flex-grow flex flex-col p-6 pb-28 text-on-surface animate-fade-in-up no-scrollbar overflow-y-auto">
      {/* Show notice when medicationId didn't match and we used a fallback */}
      {!foundMed && medicationId && (
        <div className="mb-4 p-3 rounded-lg bg-warning-container text-on-warning-container font-sans text-sm">
          Aviso: selecionado medicamento não encontrado; exibindo tratamento padrão.
        </div>
      )}
      {/* Header section with back button */}
      <section className="mb-6 pt-4">
        <button
          onClick={() => onNavigate('history')}
          className="flex items-center text-primary font-sans text-xs font-bold mb-4 hover:opacity-80 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-headline text-2xl font-black text-on-surface mb-1.5">{currentMed.name}</h2>
            <p className="font-sans text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5" />
              {currentMed.dosage} • {currentMed.category}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-inner">
            <Pill className="w-6 h-6 text-on-primary-fixed" />
          </div>
        </div>
      </section>

      {/* Grid params */}
      <section className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Freq */}
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-2 text-primary font-bold">
              <Clock className="w-4 h-4" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Frequência</span>
            </div>
            <p className="font-sans text-xs text-on-surface font-semibold">{currentMed.frequency}</p>
          </div>

          {/* Period */}
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-2 text-primary font-bold">
              <CalendarRange className="w-4 h-4" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Período</span>
            </div>
            <p className="font-sans text-xs text-on-surface font-semibold">{currentMed.period}</p>
          </div>

          {/* Progress panel */}
          <div className="col-span-2 bg-surface-container-low rounded-xl p-5 border border-outline-variant/15 mt-1 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Progresso</h3>
              <span className="font-headline text-lg font-black text-secondary">{adherencePercent}%</span>
            </div>
            {/* Progress line */}
            <div className="w-full bg-surface-variant h-3 rounded-full mb-4 overflow-hidden shadow-inner">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${adherencePercent}%` }}
              ></div>
            </div>
            {/* Split breakdowns */}
            <div className="grid grid-cols-3 gap-2 divide-x divide-outline-variant/40 text-center">
              <div className="flex flex-col">
                <span className="font-headline text-md font-bold text-on-surface">{currentMed.takenDoses}</span>
                <span className="font-sans text-[10px] text-on-surface-variant font-semibold">Tomadas</span>
              </div>
              <div className="flex flex-col pl-2">
                <span className="font-headline text-md font-bold text-on-surface">{currentMed.skippedDoses}</span>
                <span className="font-sans text-[10px] text-on-surface-variant font-semibold">Puladas</span>
              </div>
              <div className="flex flex-col pl-2">
                <span className="font-headline text-md font-bold text-on-surface">{currentMed.missedDoses}</span>
                <span className="font-sans text-[10px] text-on-surface-variant font-semibold">Atrasadas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chronological timetable */}
      <section className="mb-6">
        <h3 className="font-headline text-md font-bold text-on-surface mb-4">Cronograma de Hoje</h3>
        <div className="relative pl-6 border-l border-surface-variant/40 space-y-5 ml-2.5">
          {/* Dose 0800 */}
          <div className="relative">
            <div className="absolute -left-[33px] top-0 bg-surface rounded-full p-0.5">
              <CheckCircle2 className="w-5 h-5 text-secondary fill-secondary-container" />
            </div>
            <div className="bg-surface-container rounded-xl p-4 border border-secondary/20 shadow-sm">
              <p className="font-sans text-xs text-on-surface font-semibold">08:00</p>
              <p className="font-sans text-[10px] text-secondary font-bold mt-1 uppercase tracking-wide">Dose tomada</p>
            </div>
          </div>

          {/* Dose 1600 */}
          <div className="relative">
            <div className="absolute -left-[33px] top-0 bg-surface rounded-full p-0.5">
              <Clock className="w-5 h-5 text-outline" />
            </div>
            <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-sans text-xs text-on-surface font-semibold">16:00</p>
                <p className="font-sans text-[10px] text-on-surface-variant font-medium mt-1">
                  {isDoseRecorded1600 ? 'Dose tomada' : 'Próxima dose'}
                </p>
              </div>
              {!isDoseRecorded1600 && (
                <button
                  onClick={() => {
                    setIsDoseRecorded1600(true);
                    onTakeDose(currentMed.id);
                  }}
                  className="bg-primary text-on-primary font-sans text-xs font-bold px-4 py-2 rounded-full hover:opacity-95 transition-opacity cursor-pointer active:scale-95 shadow-sm"
                >
                  Registrar
                </button>
              )}
            </div>
          </div>

          {/* Dose 0000 */}
          <div className="relative">
            <div className="absolute -left-[33px] top-0 bg-surface rounded-full p-0.5">
              <Clock className="w-5 h-5 text-outline" />
            </div>
            <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/25 shadow-sm opacity-80">
              <p className="font-sans text-xs text-on-surface font-semibold">00:00</p>
              <p className="font-sans text-[10px] text-on-surface-variant font-medium mt-1">Agendada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons Action Group */}
      <section className="flex flex-col gap-2.5 mt-2">
        <button
          onClick={() => onNavigate('summary_report')}
          className="w-full min-h-[50px] flex items-center justify-center gap-2 border-2 border-primary text-primary font-sans text-xs font-bold rounded-xl hover:bg-primary/10 transition-colors cursor-pointer"
        >
          <Clipboard className="w-4 h-4" />
          Gerar resumo para médico
        </button>
        <button
          onClick={() => onNavigate('add_treatment')}
          className="w-full min-h-[50px] flex items-center justify-center gap-2 bg-surface-container-high text-on-surface font-sans text-xs font-bold rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer"
        >
          <Edit className="w-4 h-4 text-primary" />
          Editar tratamento
        </button>
        <button
          onClick={() => {
            onEndTreatment(currentMed.id);
            onNavigate('history');
          }}
          className="w-full min-h-[50px] flex items-center justify-center gap-2 bg-error-container text-on-error-container font-sans text-xs font-bold rounded-xl hover:opacity-90 transition-opacity mt-1 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Encerrar tratamento
        </button>
      </section>
    </div>
  );
}
