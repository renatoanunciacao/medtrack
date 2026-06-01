import React, { useState } from 'react';
import { Calendar, Save, Trash2, HeartPulse, ShieldAlert, Navigation } from 'lucide-react';
import { SymptomLog, ScreenId } from '../types';

interface SymptomsScreenProps {
  symptomLogs: SymptomLog[];
  onNavigate: (screen: ScreenId) => void;
  onAddSymptomLog: (log: SymptomLog) => void;
}

export default function SymptomsScreen({ symptomLogs, onNavigate, onAddSymptomLog }: SymptomsScreenProps) {
  // Symptom selectors
  const symptomsOptions = [
    { name: 'Dor', icon: '🤕' },
    { name: 'Febre', icon: '🤒' },
    { name: 'Náusea', icon: '🤢' },
    { name: 'Diarreia', icon: '🤢' },
    { name: 'Tontura', icon: '🌀' },
    { name: 'Alergia', icon: '🐜' },
    { name: 'Outro', icon: '➕' },
  ];

  const [selectedSymptom, setSelectedSymptom] = useState('Febre');
  const [intensity, setIntensity] = useState(6);
  const [extraNotes, setExtraNotes] = useState('');
  const [medsTaken, setMedsTaken] = useState('');

  // Calculate descriptive string
  const getIntensityText = (score: number) => {
    if (score === 0) return 'Nenhum';
    if (score <= 3) return 'Leve';
    if (score <= 5) return 'Moderada';
    if (score <= 7) return 'Moderada a forte';
    if (score <= 9) return 'Muito forte / Grave';
    return 'Extrema';
  };

  const handleSaveSymptom = () => {
    const newLog: SymptomLog = {
      id: Math.random().toString(),
      symptom: selectedSymptom,
      intensity,
      notes: extraNotes || 'Nenhuma observação informada.',
      timestamp: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      medicationTaken: medsTaken || undefined,
    };
    onAddSymptomLog(newLog);

    // Reset inputs
    setExtraNotes('');
    setMedsTaken('');
    // Scroll slightly or notify
  };

  return (
    <div className="flex-grow flex flex-col p-6 pb-28 text-on-surface animate-fade-in-up no-scrollbar overflow-y-auto">
      {/* Title greeting */}
      <section className="flex justify-between items-end mb-6 pt-4">
        <div>
          <h1 className="font-headline text-2xl font-black text-on-surface">Como você está?</h1>
          <p className="font-sans text-xs text-on-surface-variant font-medium mt-1">
            Registre seus sintomas para acompanhamento.
          </p>
        </div>
        <div className="bg-surface-container-low px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm border border-outline-variant/10 text-primary shrink-0 font-bold text-[10px] uppercase tracking-wide">
          <Calendar className="w-3.5 h-3.5" />
          <span>Hoje, 10:30</span>
        </div>
      </section>

      {/* Grid selector - Symptom list */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-md mb-4">
        <h2 className="font-headline text-sm font-bold text-on-surface mb-3 uppercase tracking-wider opacity-90">Sintoma principal</h2>
        <div className="grid grid-cols-4 gap-2">
          {symptomsOptions.map((opt) => (
            <button
              key={opt.name}
              onClick={() => setSelectedSymptom(opt.name)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                selectedSymptom === opt.name
                  ? 'bg-primary-fixed border-primary text-on-primary-fixed font-bold shadow-md'
                  : 'bg-surface-container border-transparent text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="text-xl mb-1 select-none">{opt.icon}</span>
              <span className="font-sans text-[10px] truncate w-full text-center">{opt.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Intensity selector Slider */}
      <section className="bg-error-container/10 rounded-2xl p-5 border border-error-container/30 flex flex-col justify-between mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider opacity-90">Intensidade</h2>
          <span className="w-3 h-3 bg-error rounded-full animate-ping"></span>
        </div>
        
        <div className="text-center py-2">
          <span className="text-4xl font-extrabold text-on-surface leading-none tracking-tight">{intensity}</span>
          <span className="font-sans text-xs text-on-surface-variant font-semibold block mt-1">
            {getIntensityText(intensity)}
          </span>
        </div>

        <div className="pt-4">
          <input
            type="range"
            min="0"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full h-1.5 bg-primary-fixed rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-on-surface-variant uppercase font-bold mt-2.5 px-0.5">
            <span>0 (Leve)</span>
            <span>5</span>
            <span>10 (Grave)</span>
          </div>
        </div>
      </section>

      {/* Supplemental Medication list & Notes Area */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-md mb-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider opacity-90" htmlFor="took-med">
            Algum medicamento adicional tomado?
          </label>
          <input
            id="took-med"
            type="text"
            value={medsTaken}
            onChange={(e) => setMedsTaken(e.target.value)}
            placeholder="Ex: Tomou Paracetamol, Tylenol..."
            className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider opacity-90" htmlFor="obs-desc">
            Observações adicionais
          </label>
          <textarea
            id="obs-desc"
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder="Como você está se sentindo em detalhes? Desencadeou por algo específico?"
            rows={2}
            className="w-full bg-surface border border-outline-variant/35 rounded-xl p-4 font-sans text-xs text-on-surface placeholder:text-outline outline-none focus:border-primary transition-all resize-none"
          ></textarea>
        </div>
      </section>

      {/* Direct CTA action to register symptom */}
      <section className="mb-6">
        <button
          onClick={handleSaveSymptom}
          className="w-full min-h-[52px] bg-primary text-on-primary rounded-full font-headline text-sm font-black tracking-wide flex justify-center items-center gap-2 shadow-[0_4px_15px_rgba(0,93,167,0.15)] hover:bg-primary/95 transition-all cursor-pointer active:scale-95"
        >
          <Save className="w-4 h-4 text-on-primary" />
          Salvar Sintoma
        </button>
      </section>

      {/* History chronological symptoms feed list */}
      <section className="mt-2 text-on-surface">
        <h3 className="font-headline text-md font-bold text-on-surface mb-3">Sintomas registrados</h3>
        
        <div className="space-y-4 relative pl-3 border-l border-surface-variant/40 ml-2.5">
          {symptomLogs.map((log) => (
            <div key={log.id} className="relative">
              {/* Vertical timeline small rounded badge bubble */}
              <div className="absolute -left-[23px] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background shadow flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              
              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/10 shadow-sm ml-2.5">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-sans text-xs font-bold text-on-surface">{log.symptom}</span>
                  <span className="font-sans text-[10px] text-on-surface-variant font-medium">{log.timestamp}</span>
                </div>
                
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-3">
                  {log.notes}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 bg-error-container/30 text-error rounded font-sans text-[10px] font-bold">
                    Intensidade: {log.intensity} - {getIntensityText(log.intensity)}
                  </span>
                  {log.medicationTaken && (
                    <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded font-sans text-[10px] font-semibold uppercase tracking-wider border border-white/5">
                      {log.medicationTaken}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
