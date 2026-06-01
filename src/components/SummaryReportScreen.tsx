import React from 'react';
import { ArrowLeft, Landmark, FileText, Share2, Award, Pill, Activity, Terminal } from 'lucide-react';
import { Medication, SymptomLog, ScreenId } from '../types';

interface SummaryReportScreenProps {
  medicationId: string;
  medications: Medication[];
  symptomLogs: SymptomLog[];
  onNavigate: (screen: ScreenId) => void;
}

export default function SummaryReportScreen({
  medicationId,
  medications,
  symptomLogs,
  onNavigate,
}: SummaryReportScreenProps) {
  const currentMed = medications.find((m) => m.id === medicationId) || medications[0];

  const taken = currentMed ? currentMed.takenDoses : 20;
  const total = currentMed ? currentMed.totalDoses : 21;
  const percent = currentMed ? Math.round((taken / total) * 100) : 95;

  // Render SVG circular progress matching 95% circular stroke-dasharray/offset
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex-grow flex flex-col p-6 pb-28 text-on-surface animate-fade-in-up no-scrollbar overflow-y-auto">
      {/* Native App Top Header */}
      <header className="flex justify-between items-center h-16 border-b border-surface-container-highest/20 mb-6">
        <button
          onClick={() => onNavigate('treatment_details')}
          className="text-primary hover:bg-surface-container-high transition-colors duration-200 p-2 rounded-full flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <span className="font-headline text-md font-bold text-primary">Resumo do Tratamento</span>
        <div className="w-10"></div> {/* Spacer balance */}
      </header>

      {/* Main Container Content */}
      <div className="flex flex-col gap-6">
        {/* Core clinical patient card summary */}
        <section className="text-center space-y-1">
          <h2 className="font-headline text-xl font-bold text-on-surface">
            {currentMed ? `${currentMed.name} ${currentMed.dosage}` : 'Amoxicilina 500mg'}
          </h2>
          <p className="font-sans text-xs text-on-surface-variant font-medium">
            Paciente: Maria Silva • Data: 24 Out 2023
          </p>
        </section>

        {/* Bento stats split */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Details */}
          <div className="bg-surface-container rounded-2xl p-5 shadow-lg border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                  <Pill className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-headline text-md font-bold text-on-surface">Detalhes</h3>
              </div>
              <ul className="space-y-3 font-sans text-xs text-on-surface-variant font-medium">
                <li className="flex justify-between border-b border-surface-variant/40 pb-1.5">
                  <span>Duração</span>
                  <span className="font-sans text-[11px] font-bold text-on-surface">
                    {currentMed ? `${currentMed.durationDays} dias` : '7 dias'}
                  </span>
                </li>
                <li className="flex justify-between border-b border-surface-variant/40 pb-1.5">
                  <span>Posologia</span>
                  <span className="font-sans text-[11px] font-bold text-on-surface">
                    {currentMed ? currentMed.frequency : '1 cap a cada 8h'}
                  </span>
                </li>
                <li className="flex justify-between pt-1">
                  <span>Doses perdidas / puladas</span>
                  <span className={`font-sans text-[11px] font-bold ${currentMed && currentMed.skippedDoses > 0 ? 'text-error' : 'text-secondary'}`}>
                    {currentMed ? currentMed.skippedDoses + currentMed.missedDoses : 1} dose
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Circular adherence card percentage */}
          <div className="bg-surface-container rounded-2xl p-5 shadow-lg border border-outline-variant/20 flex flex-col justify-center items-center text-center">
            <h3 className="font-headline text-sm font-bold text-on-surface mb-3 w-full text-left uppercase tracking-wider opacity-90">
              Adesão ao Tratamento
            </h3>
            
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              {/* circular vector display */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background track circle */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r={normalizedRadius}
                  stroke="#323538"
                  strokeWidth={stroke}
                />
                {/* Foreground color level circle */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r={normalizedRadius}
                  stroke="#a1c9ff"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Inner central text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline text-2xl font-black text-primary">{percent}%</span>
              </div>
            </div>
            
            <p className="font-sans text-xs text-on-surface-variant font-medium">
              {taken} de {total} doses tomadas
            </p>
          </div>
        </section>

        {/* Symptoms Summary registered panel */}
        <section className="bg-surface-container rounded-2xl p-5 shadow-lg border border-outline-variant/25">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-error-container/30 flex items-center justify-center text-error border border-error-container/30">
              <Activity className="w-5 h-5 text-error" />
            </div>
            <h3 className="font-headline text-md font-bold text-on-surface">Sintomas Registrados</h3>
          </div>

          <div className="space-y-2.5">
            {symptomLogs.length > 0 ? (
              symptomLogs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-surface-container-high rounded-xl border border-white/5">
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-bold text-on-surface">{log.symptom}</span>
                    <span className="font-sans text-[10px] text-on-surface-variant font-medium">
                      Intensidade {log.intensity} ({log.intensity > 5 ? 'Moderada a forte' : 'Leve'})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 bg-surface-container-highest px-3 py-1 rounded-full text-[10px] font-semibold text-on-surface border border-white/5">
                    <Award className="w-3.5 h-3.5 text-primary" />
                    <span>Concluído</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center font-sans text-xs text-on-surface-variant py-4">
                Nenhum sintoma registrado recentemente para este tratamento.
              </div>
            )}
          </div>
        </section>

        {/* Clinical Document CTEs Share buttons */}
        <section className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => alert('PDF clínico gerado e preparado para envio!')}
            className="w-full sm:w-1/2 min-h-[50px] bg-primary text-on-primary font-sans text-xs font-bold rounded-full flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors shadow-md active:scale-95 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-on-primary" />
            <span>Compartilhar resumo</span>
          </button>
          
          <button
            onClick={() => alert('Exportando relatório médico para a pasta de downloads local...')}
            className="w-full sm:w-1/2 min-h-[50px] border border-outline text-primary font-sans text-xs font-bold rounded-full flex items-center justify-center gap-1.5 hover:bg-surface-container transition-colors cursor-pointer active:scale-95"
          >
            <FileText className="w-4 h-4 text-primary" />
            <span>Exportar PDF</span>
          </button>
        </section>
      </div>
    </div>
  );
}
