import { BellRing, ClipboardCheck, History, HeartPulse, ArrowRight } from 'lucide-react';
import { ScreenId } from '../types';

interface OnboardingScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export default function OnboardingScreen({ onNavigate }: OnboardingScreenProps) {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 pb-24 text-on-surface animate-fade-in-up">
      {/* Scrollable container for main content */}
      <div className="flex-1 flex flex-col pt-4">
        {/* Header / Logo */}
        <header className="flex flex-col items-center justify-center mb-6">
          <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center mb-2 shadow-lg ring-4 ring-primary/20">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-primary tracking-tight">MedTrack</h1>
          <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mt-1 opacity-80">Sua dose de tranquilidade</span>
        </header>

        {/* Hero Section Container */}
        <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl mb-6 ring-1 ring-white/10 group">
          <img
            alt="Medicamentos Organizados"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AP1WRLuB8Hgxrmf2WRP0GUJdZqi-05wsxH-9yVb-RVA1cVU-BDp15sp_2_cYZXlgfz5CQCiMRygdexiAUpRpKpurVY5pnGfWK1xGwbRbSLdhPim2-I1INvh7Si985TgEIeTC2qzNededwcg0AdmJBhCwkDlzGkiPqSgGkIdEEcWZ0xKr3NCp3BrCa9W6SmGYr1EBUPyBbIvjbqpSB8f77dLZf6f-7_Zkp38Jsp1RoFMS4TS97GP9K2aVa8dp8rSv"
          />
          {/* Subtle gradient overlay for clean contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
        </div>

        {/* Typography Intro */}
        <div className="text-center mb-6 px-2">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-2 leading-snug tracking-tight">
            Organize seus remédios e nunca perca uma dose.
          </h2>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto">
            Seu companheiro diário para um tratamento tranquilo e eficiente.
          </p>
        </div>

        {/* Bento Grid Benefits */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Benefit 1 */}
          <div className="bg-surface-container p-4 rounded-2xl border border-surface-container-high flex flex-col items-start gap-2 hover:border-primary/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-primary" />
            </div>
            <span className="font-sans text-xs font-semibold text-on-surface leading-tight">
              Lembretes no horário certo
            </span>
          </div>

          {/* Benefit 2 */}
          <div className="bg-surface-container p-4 rounded-2xl border border-surface-container-high flex flex-col items-start gap-2 hover:border-primary/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-5 h-5 text-on-secondary-container" />
            </div>
            <span className="font-sans text-xs font-semibold text-on-surface leading-tight">
              Controle de doses tomadas
            </span>
          </div>

          {/* Benefit 3 */}
          <div className="bg-surface-container p-4 rounded-2xl border border-surface-container-high flex flex-col items-start gap-2 hover:border-primary/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 flex items-center justify-center shrink-0">
              <History className="w-5 h-5 text-tertiary" />
            </div>
            <span className="font-sans text-xs font-semibold text-on-surface leading-tight">
              Histórico do tratamento
            </span>
          </div>

          {/* Benefit 4 */}
          <div className="bg-surface-container p-4 rounded-2xl border border-surface-container-high flex flex-col items-start gap-2 hover:border-primary/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-error-container/30 flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5 text-error" />
            </div>
            <span className="font-sans text-xs font-semibold text-on-surface leading-tight">
              Resumo para consulta médica
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Sticky Action Area */}
      <div className="absolute bottom-6 left-0 right-0 px-6 z-10 flex justify-center bg-transparent">
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full max-w-sm min-h-[56px] bg-primary text-on-primary rounded-full font-sans text-sm font-bold flex justify-center items-center gap-2 shadow-[0_8px_25px_rgba(161,201,255,0.3)] active:scale-[0.98] hover:bg-primary/90 transition-all duration-200 cursor-pointer"
        >
          Começar
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
