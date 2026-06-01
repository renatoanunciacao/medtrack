import {
  ArrowRight,
  BellRing,
  Calendar,
  CheckCircle,
  Flag,
  Pill,
  Undo2,
} from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { Medication, ScreenId } from "../types";

interface AddTreatmentScreenProps {
  onAddMedication: (medication: Medication) => void;
  onNavigate: (screen: ScreenId) => void;
}

type Frequency =
  | "A cada 8 horas"
  | "A cada 12 horas"
  | "Uma vez ao dia";

const getDosesPerDay = (frequency: string) => {
  if (frequency.includes("8 horas")) return 3;
  if (frequency.includes("12 horas")) return 2;
  return 1;
};

const normalizeTime = (value: string) => {
  const [hours = "08", minutes = "00"] = value.split(":");

  const parsedHours = Number(hours);
  const parsedMinutes = Number(minutes);

  const safeHours =
    Number.isFinite(parsedHours) && parsedHours >= 0 && parsedHours <= 23
      ? parsedHours
      : 8;

  const safeMinutes =
    Number.isFinite(parsedMinutes) && parsedMinutes >= 0 && parsedMinutes <= 59
      ? parsedMinutes
      : 0;

  return `${String(safeHours).padStart(2, "0")}:${String(
    safeMinutes
  ).padStart(2, "0")}`;
};

const addHoursToTime = (time: string, hoursToAdd: number) => {
  const [hours, minutes] = normalizeTime(time).split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setHours(date.getHours() + hoursToAdd);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};

const buildMedicationTimes = (frequency: Frequency, firstDoseTime: string) => {
  const normalizedFirstDoseTime = normalizeTime(firstDoseTime);

  if (frequency === "A cada 8 horas") {
    return [
      normalizedFirstDoseTime,
      addHoursToTime(normalizedFirstDoseTime, 8),
      addHoursToTime(normalizedFirstDoseTime, 16),
    ];
  }

  if (frequency === "A cada 12 horas") {
    return [
      normalizedFirstDoseTime,
      addHoursToTime(normalizedFirstDoseTime, 12),
    ];
  }

  return [normalizedFirstDoseTime];
};

const createMedicationId = (name: string) => {
  const normalizedName = name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${normalizedName || "medicamento"}-${Date.now()}`;
};

export default function AddTreatmentScreen({
  onAddMedication,
  onNavigate,
}: AddTreatmentScreenProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("Clindamicina");
  const [dosage, setDosage] = useState("1 cápsula");
  const [category, setCategory] = useState("Antibiótico");
  const [frequency, setFrequency] = useState<Frequency>("A cada 8 horas");
  const [durationDays, setDurationDays] = useState(7);
  const [firstDoseTime, setFirstDoseTime] = useState("16:00");

  const dosesPerDay = useMemo(
    () => getDosesPerDay(frequency),
    [frequency]
  );

  const totalEstimatedDoses = useMemo(
    () => durationDays * dosesPerDay,
    [durationDays, dosesPerDay]
  );

  const medicationTimes = useMemo(
    () => buildMedicationTimes(frequency, firstDoseTime),
    [frequency, firstDoseTime]
  );

  const isFormValid =
    name.trim().length > 0 &&
    dosage.trim().length > 0 &&
    durationDays > 0 &&
    firstDoseTime.trim().length > 0;

  const handleDurationChange = (value: string) => {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      setDurationDays(1);
      return;
    }

    setDurationDays(parsedValue);
  };

  const handleSaveAndConfirm = () => {
    if (!isFormValid) return;

    const newMed: Medication = {
      id: createMedicationId(name),
      name: name.trim(),
      dosage: dosage.trim(),
      category,
      frequency,
      period: `Hoje - ${durationDays} dias`,
      durationDays,
      totalDoses: totalEstimatedDoses,
      takenDoses: 0,
      skippedDoses: 0,
      missedDoses: 0,
      status: "active",
      requirements: ["Tomar com água", "Seguir orientação médica"],
      times: medicationTimes,
    };

    onAddMedication(newMed);
    onNavigate("dashboard");
  };

  return (
    <div className="flex-grow flex flex-col p-6 pb-28 text-on-surface animate-fade-in-up relative no-scrollbar overflow-y-auto">
      {step === 1 && (
        <div className="flex flex-col gap-5 pt-4">
          <header className="flex items-center gap-3 mb-2">
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="text-primary hover:bg-surface-variant p-2 rounded-full flex items-center justify-center cursor-pointer"
            >
              <Undo2 className="w-5 h-5" />
            </button>

            <h2 className="font-headline text-lg font-bold">
              Novo Tratamento
            </h2>
          </header>

          <section className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/20 shadow-sm flex flex-col gap-2">
            <h3 className="font-headline text-sm font-bold text-primary">
              Cadastro manual do tratamento
            </h3>

            <p className="font-sans text-xs text-on-surface-variant">
              Preencha os dados conforme a receita médica. A leitura automática
              por IA está desativada neste momento.
            </p>
          </section>

          <div className="flex flex-col gap-4 bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 shadow-md">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Nome do medicamento
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex: Clindamicina, Amoxicilina..."
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-sans text-sm text-on-surface outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Categoria
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  "Antibiótico",
                  "Analgésico",
                  "Polivitamínico",
                  "Anti-inflamatório",
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      category === cat
                        ? "bg-primary border-primary text-on-primary font-semibold"
                        : "bg-surface border-outline-variant/30 text-on-surface-variant"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Dose
                </label>

                <input
                  type="text"
                  value={dosage}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setDosage(event.target.value)}
                  placeholder="Ex: 1 cápsula, 20 gotas"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 font-sans text-sm text-on-surface outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Intervalo
                </label>

                <select
                  value={frequency}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    setFrequency(event.target.value as Frequency)
                  }
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 font-sans text-sm text-on-surface outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="A cada 8 horas">A cada 8 horas</option>
                  <option value="A cada 12 horas">A cada 12 horas</option>
                  <option value="Uma vez ao dia">Uma vez ao dia</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Duração em dias
                </label>

                <input
                  type="number"
                  min={1}
                  value={durationDays}
                  onChange={(event) =>
                    handleDurationChange(event.target.value)
                  }
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 font-sans text-sm text-on-surface outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Primeira dose
                </label>

                <input
                  type="time"
                  value={normalizeTime(firstDoseTime)}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setFirstDoseTime(event.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 font-sans text-sm text-on-surface outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4 border border-outline-variant/20">
              <span className="block font-sans text-[10px] font-bold text-outline uppercase tracking-wider mb-1">
                Resumo calculado
              </span>

              <p className="font-sans text-sm text-on-surface">
                {dosage || "Dose"} {frequency.toLowerCase()} por{" "}
                {durationDays} dias.
              </p>

              <p className="font-sans text-xs text-on-surface-variant mt-1">
                Total estimado: {totalEstimatedDoses} dose
                {totalEstimatedDoses === 1 ? "" : "s"}.
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 px-6 z-10 flex justify-center bg-transparent">
            <button
              type="button"
              disabled={!isFormValid}
              onClick={() => setStep(2)}
              className={`w-full max-w-sm min-h-[56px] rounded-full font-sans text-sm font-bold flex justify-center items-center gap-2 shadow-[0_8px_25px_rgba(161,201,255,0.3)] transition-all duration-200 ${
                isFormValid
                  ? "bg-primary text-on-primary active:scale-[0.98] hover:bg-primary/95 cursor-pointer"
                  : "bg-outline-variant text-on-surface-variant cursor-not-allowed"
              }`}
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col justify-between pt-2">
          <section className="flex flex-col items-center pt-8 pb-4 text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mb-5 shadow-lg ring-8 ring-primary/20">
              <CheckCircle className="w-10 h-10 fill-on-primary text-primary" />
            </div>

            <h1 className="font-headline text-2xl font-black text-on-surface mb-1">
              Tratamento salvo!
            </h1>

            <p className="font-sans text-sm text-on-surface-variant max-w-[280px]">
              Revise os detalhes abaixo antes de ativar os lembretes.
            </p>
          </section>

          <section className="flex-1 flex flex-col justify-start mb-6">
            <div className="bg-surface-container-lowest rounded-[24px] shadow-2xl border border-surface-container-highest/60 p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container" />

              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-surface-container-highest">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center shrink-0">
                  <Pill className="w-6 h-6 text-on-primary-fixed" />
                </div>

                <div>
                  <h2 className="font-headline text-lg font-bold text-on-surface leading-tight">
                    {name}
                  </h2>

                  <span className="inline-flex items-center mt-1 font-sans text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-center">
                  <span className="block font-sans text-[10px] font-bold text-outline uppercase tracking-wider mb-0.5">
                    Dose
                  </span>
                  <span className="block font-sans text-sm text-on-surface font-semibold">
                    {dosage}
                  </span>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-center">
                  <span className="block font-sans text-[10px] font-bold text-outline uppercase tracking-wider mb-0.5">
                    Intervalo
                  </span>
                  <span className="block font-sans text-sm text-on-surface font-semibold">
                    {frequency}
                  </span>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-center">
                  <span className="block font-sans text-[10px] font-bold text-outline uppercase tracking-wider mb-0.5">
                    Duração
                  </span>
                  <span className="block font-sans text-sm text-on-surface font-semibold">
                    {durationDays} dias
                  </span>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-center">
                  <span className="block font-sans text-[10px] font-bold text-outline uppercase tracking-wider mb-0.5">
                    Total estimado
                  </span>
                  <span className="block font-sans text-sm text-on-surface font-semibold">
                    {totalEstimatedDoses} doses
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Calendar className="w-4 h-4" />
                  <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Cronograma
                  </h3>
                </div>

                <div className="flex flex-col relative pl-6">
                  <div className="absolute left-[9px] top-[14px] bottom-[14px] w-[2px] bg-surface-container-highest" />

                  <div className="flex gap-4 relative mb-4">
                    <div className="absolute -left-[22px] top-1.5 w-4 h-4 bg-primary text-on-primary rounded-full flex items-center justify-center shrink-0 ring-4 ring-surface-container-low">
                      <div className="w-1.5 h-1.5 bg-on-primary rounded-full" />
                    </div>

                    <div>
                      <span className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider">
                        Primeira dose
                      </span>
                      <span className="block font-sans text-xs text-on-surface">
                        Hoje às {normalizeTime(firstDoseTime)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 relative mb-4">
                    <div className="absolute -left-[22px] top-1.5 w-4 h-4 bg-surface-container-highest rounded-full flex items-center justify-center shrink-0 ring-4 ring-surface-container-low" />

                    <div>
                      <span className="block font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
                        Próximos horários
                      </span>
                      <span className="block font-sans text-xs text-on-surface">
                        {medicationTimes.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="absolute -left-[22px] top-1 w-4 h-4 bg-secondary text-on-secondary rounded-full flex items-center justify-center shrink-0 ring-4 ring-surface-container-low">
                      <Flag className="w-2.5 h-2.5 text-on-secondary font-bold" />
                    </div>

                    <div>
                      <span className="block font-sans text-[10px] font-bold text-secondary uppercase tracking-wider">
                        Término previsto
                      </span>
                      <span className="block font-sans text-xs text-on-surface">
                        Em {durationDays} dias
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="absolute bottom-6 left-0 right-0 px-6 z-10 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSaveAndConfirm}
              className="w-full min-h-[56px] bg-primary text-on-primary rounded-xl font-sans text-sm font-bold flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(161,201,255,0.2)] hover:bg-primary/95 transition-all cursor-pointer active:scale-[0.98]"
            >
              <BellRing className="w-5 h-5 text-on-primary" />
              Confirmar e ativar lembretes
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full min-h-[48px] bg-transparent text-primary hover:bg-surface-container-low font-sans text-sm font-semibold rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            >
              Editar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}