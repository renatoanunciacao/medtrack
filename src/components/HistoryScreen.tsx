import { Pill, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Medication, ScreenId } from '../types';

interface HistoryScreenProps {
  medications: Medication[];
  onNavigate: (screen: ScreenId) => void;
  onSelectMedication: (id: string) => void;
}

export default function HistoryScreen({ medications, onNavigate, onSelectMedication }: HistoryScreenProps) {
  const handleClickItem = (id: string) => {
    onSelectMedication(id);
    onNavigate('treatment_details');
  };

  return (
    <div className="flex-grow flex flex-col p-6 pb-28 text-on-surface animate-fade-in-up no-scrollbar overflow-y-auto">
      {/* Title & Desc */}
      <div className="mb-6 pt-4">
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-1">Histórico</h2>
        <p className="font-sans text-xs text-on-surface-variant font-medium">
          Revise seus tratamentos anteriores e em andamento.
        </p>
      </div>

      {/* Grid List of medications with correct styled frames */}
      <div className="flex flex-col gap-4">
        {medications.map((med) => {
          // Status styled badges
          let statusText = 'Em andamento';
          let statusColorClass = 'bg-primary/20 text-primary-fixed-dim';
          let borderOverlayClass = 'border-l-primary';
          let iconBgClass = 'bg-primary-container/20 text-primary';
          let iconElement = <Pill className="w-5 h-5" />;

          if (med.status === 'completed') {
            statusText = 'Concluído';
            statusColorClass = 'bg-secondary/20 text-secondary-fixed-dim';
            borderOverlayClass = 'border-l-secondary';
            iconBgClass = 'bg-secondary-container/30 text-secondary';
            iconElement = <CheckCircle className="w-5 h-5 fill-secondary-container" />;
          } else if (med.status === 'interrupted') {
            statusText = 'Interrompido';
            statusColorClass = 'bg-error/20 text-error';
            borderOverlayClass = 'border-l-error';
            iconBgClass = 'bg-error-container/20 text-error';
            iconElement = <XCircle className="w-5 h-5 fill-error-container/20" />;
          }

          const progressPercent = Math.round((med.takenDoses / med.totalDoses) * 100) || 0;

          return (
            <div
              key={med.id}
              onClick={() => handleClickItem(med.id)}
              className="bg-surface-container rounded-2xl p-5 shadow-lg border border-surface-container-high hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group hover:border-outline-variant/50"
            >
              {/* Highlight accent bar on left */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${med.status === 'active' ? 'bg-primary' : med.status === 'completed' ? 'bg-secondary' : 'bg-error'}`}></div>

              <div className="flex justify-between items-start mb-4 pl-1">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                    {iconElement}
                  </div>
                  <div>
                    <h3 className="font-headline text-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      {med.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider ${statusColorClass}`}>
                        {statusText}
                      </span>
                      <span className="text-on-surface-variant font-sans text-[10px] font-semibold">
                        {med.period}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors shrink-0" />
              </div>

              {/* Unique layout for active (progress bar) vs completed (recap grid) */}
              <div className="pl-1 mt-2">
                {med.status === 'active' ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between font-sans text-xs mb-1">
                      <span className="text-on-surface-variant font-medium">Progresso</span>
                      <span className="text-primary font-semibold">
                        {med.takenDoses}/{med.totalDoses} doses
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-8">
                    <div>
                      <span className="block font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Doses Tomadas
                      </span>
                      <span className="font-headline text-lg font-bold text-secondary">
                        {med.takenDoses}
                      </span>
                    </div>
                    <div>
                      <span className="block font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Doses Perdidas
                      </span>
                      <span className="font-headline text-lg font-bold text-on-surface">
                        {med.missedDoses + med.skippedDoses}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
