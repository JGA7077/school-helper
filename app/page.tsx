"use client";

import { useCallback, useMemo, useRef, useState } from "react";

const EXERCISE_COUNT = 8;
const QUICK_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ROW_COLORS = [
  "bg-rose-100 border-rose-200 text-rose-800",
  "bg-orange-100 border-orange-200 text-orange-800",
  "bg-amber-100 border-amber-200 text-amber-900",
  "bg-lime-100 border-lime-200 text-lime-800",
  "bg-emerald-100 border-emerald-200 text-emerald-800",
  "bg-teal-100 border-teal-200 text-teal-800",
  "bg-sky-100 border-sky-200 text-sky-800",
  "bg-indigo-100 border-indigo-200 text-indigo-800",
  "bg-violet-100 border-violet-200 text-violet-800",
  "bg-fuchsia-100 border-fuchsia-200 text-fuchsia-800",
];

const PRAISE = [
  "Uhu! Você arrasou! 🎉",
  "Muito bem! ⭐",
  "Isso aí, campeão(ã)! 🏆",
  "Que conta rápida! 🚀",
  "Você é demais! 🌈",
];

const ENCOURAGE = [
  "Quase! Vamos tentar de novo? 💪",
  "Não desiste, você consegue! 🌟",
  "Errar faz parte — bora praticar! 🦸",
];

const MASCOT_IDLE = "Oi! Eu sou o Estrelinha ⭐ Escolha um número para começar a aventura!";
const MASCOT_PLAYING = "Olha só a tabuada! Depois responde os desafios e ganhe estrelas!";
const MASCOT_HALF = "Metade dos desafios! Você está indo muito bem! 🌟";
const MASCOT_DONE = "UAU! Você completou todos os desafios! Você é um super herói da matemática! 🦸‍♀️🎊";

const CONFETTI_COLORS = [
  "#f472b6",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#a78bfa",
];

type Exercise = {
  id: string;
  multiplier: number;
};

type ExerciseState = Exercise & {
  answer: string;
  checked: boolean;
  correct: boolean | null;
  praise?: string;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function createExercises(base: number): Exercise[] {
  const multipliers = shuffle(
    Array.from({ length: 10 }, (_, i) => i + 1),
  ).slice(0, Math.min(EXERCISE_COUNT, 10));

  return multipliers.map((multiplier) => ({
    id: `${base}-${multiplier}-${Math.random().toString(36).slice(2, 9)}`,
    multiplier,
  }));
}

type ConfettiPiece = {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
};

function createConfettiPieces(burstKey: number): ConfettiPiece[] {
  return Array.from({ length: 48 }, (_, i) => {
    const n = burstKey * 1000 + i * 73;
    return {
      id: i,
      left: (n * 17) % 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: ((n * 13) % 80) / 100,
      duration: 2.2 + ((n * 29) % 150) / 100,
    };
  });
}

function Confetti({ pieces }: { pieces: ConfettiPiece[] }) {

  if (pieces.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function Mascot({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border-4 border-amber-300 bg-amber-50 p-4 shadow-md">
      <span
        className="animate-float text-5xl leading-none"
        role="img"
        aria-label="Estrelinha mascote"
      >
        ⭐
      </span>
      <div className="relative flex-1 rounded-2xl bg-white px-4 py-3 text-base font-medium text-violet-900 shadow-inner">
        <span
          className="absolute -left-2 top-4 h-0 w-0 border-y-8 border-r-8 border-y-transparent border-r-white"
          aria-hidden
        />
        {message}
      </div>
    </div>
  );
}

function StarBar({ earned, total }: { earned: number; total: number }) {
  const percent = total > 0 ? Math.round((earned / total) * 100) : 0;

  return (
    <div className="rounded-2xl border-4 border-violet-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between text-sm font-bold text-violet-800">
        <span>⭐ Estrelas: {earned} de {total}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-violet-100">
        <div
          className="h-full rounded-full bg-linear-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-3 flex justify-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`text-2xl transition-transform ${
              i < earned ? "animate-pop-star scale-110" : "opacity-30 grayscale"
            }`}
          >
            ⭐
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [baseNumber, setBaseNumber] = useState<number | null>(null);
  const [exercises, setExercises] = useState<ExerciseState[]>([]);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiBurstRef = useRef(0);

  const tableRows = useMemo(() => {
    if (baseNumber === null) return [];
    return Array.from({ length: 10 }, (_, i) => i + 1);
  }, [baseNumber]);

  const starsEarned = exercises.filter((ex) => ex.correct === true).length;
  const allCorrect =
    exercises.length > 0 &&
    exercises.every((ex) => ex.correct === true);

  const mascotMessage = useMemo(() => {
    if (baseNumber === null) return MASCOT_IDLE;
    if (allCorrect) return MASCOT_DONE;
    if (starsEarned >= Math.ceil(exercises.length / 2)) return MASCOT_HALF;
    return MASCOT_PLAYING;
  }, [baseNumber, allCorrect, starsEarned, exercises.length]);

  const triggerCelebration = useCallback(() => {
    confettiBurstRef.current += 1;
    setConfettiPieces(createConfettiPieces(confettiBurstRef.current));
    if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
    confettiTimerRef.current = setTimeout(() => {
      setConfettiPieces([]);
    }, 4500);
  }, []);

  const clearCelebration = useCallback(() => {
    if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
    setConfettiPieces([]);
  }, []);

  const applyNumber = useCallback((value: string) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      setBaseNumber(null);
      setExercises([]);
      clearCelebration();
      return;
    }
    setBaseNumber(parsed);
    setExercises(
      createExercises(parsed).map((ex) => ({
        ...ex,
        answer: "",
        checked: false,
        correct: null,
      })),
    );
    clearCelebration();
  }, [clearCelebration]);

  const handleSubmitNumber = (e: React.FormEvent) => {
    e.preventDefault();
    applyNumber(inputValue);
  };

  const selectQuickNumber = (n: number) => {
    const value = String(n);
    setInputValue(value);
    applyNumber(value);
  };

  const regenerateExercises = () => {
    if (baseNumber === null) return;
    setExercises(
      createExercises(baseNumber).map((ex) => ({
        ...ex,
        answer: "",
        checked: false,
        correct: null,
      })),
    );
    clearCelebration();
  };

  const updateAnswer = (id: string, answer: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, answer, checked: false, correct: null, praise: undefined }
          : ex,
      ),
    );
  };

  const checkAnswer = (id: string) => {
    if (baseNumber === null) return;
    let wonRound = false;
    setExercises((prev) => {
      const next = prev.map((ex) => {
        if (ex.id !== id) return ex;
        const expected = baseNumber * ex.multiplier;
        const given = Number.parseInt(ex.answer, 10);
        const correct = !Number.isNaN(given) && given === expected;
        return {
          ...ex,
          checked: true,
          correct,
          praise: correct ? pickRandom(PRAISE) : pickRandom(ENCOURAGE),
        };
      });
      wonRound =
        next.length > 0 && next.every((ex) => ex.correct === true);
      return next;
    });
    if (wonRound) triggerCelebration();
  };

  return (
    <div className="relative min-h-full overflow-x-hidden bg-linear-to-b from-sky-100 via-amber-50 to-rose-100 px-4 py-8 text-violet-950">
      <Confetti pieces={confettiPieces} />

      <main className="relative z-10 mx-auto w-full max-w-xl">
        <header className="mb-6 text-center">
          <p className="animate-wiggle text-4xl" aria-hidden>
            🎒✨🔢
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-violet-700 drop-shadow-sm">
            Aventura da Tabuada
          </h1>
          <p className="mt-2 text-lg font-medium text-violet-600">
            Aprenda brincando e colecione estrelas!
          </p>
        </header>

        <div className="mb-6">
          <Mascot message={mascotMessage} />
        </div>

        <form
          onSubmit={handleSubmitNumber}
          className="rounded-3xl border-4 border-sky-300 bg-white p-6 shadow-lg"
        >
          <label
            htmlFor="base-number"
            className="block text-lg font-bold text-sky-800"
          >
            Qual tabuada vamos explorar?
          </label>
          <div className="mt-3 flex gap-3">
            <input
              id="base-number"
              type="number"
              min={1}
              max={12}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite um número"
              className="w-full rounded-2xl border-4 border-sky-200 bg-sky-50 px-4 py-3 text-2xl font-bold text-violet-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
            />
            <button
              type="submit"
              className="shrink-0 rounded-2xl border-b-4 border-orange-600 bg-orange-400 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-orange-500 active:translate-y-0.5 active:border-b-2"
            >
              Vamos! 🚀
            </button>
          </div>

          <p className="mt-4 text-sm font-semibold text-violet-600">
            Ou escolha rápido:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_NUMBERS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => selectQuickNumber(n)}
                className={`h-12 w-12 rounded-2xl border-b-4 text-lg font-bold shadow-sm transition active:translate-y-0.5 active:border-b-2 ${
                  baseNumber === n
                    ? "border-violet-600 bg-violet-400 text-white"
                    : "border-violet-300 bg-violet-100 text-violet-800 hover:bg-violet-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </form>

        {baseNumber !== null && (
          <>
            <section
              aria-label="Tabuada"
              className="mt-8 animate-bounce-in rounded-3xl border-4 border-emerald-300 bg-white p-6 shadow-lg"
            >
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-extrabold text-emerald-700">
                <span aria-hidden>📖</span>
                Tabuada do {baseNumber}
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {tableRows.map((multiplier, index) => (
                  <li
                    key={multiplier}
                    className={`rounded-2xl border-2 px-4 py-2.5 text-lg font-bold ${ROW_COLORS[index % ROW_COLORS.length]}`}
                  >
                    {baseNumber} × {multiplier} ={" "}
                    <span className="text-xl">{baseNumber * multiplier}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-label="Desafios"
              className="mt-8 rounded-3xl border-4 border-rose-300 bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-2xl font-extrabold text-rose-600">
                  <span aria-hidden>🎮</span>
                  Desafios
                </h2>
                <button
                  type="button"
                  onClick={regenerateExercises}
                  className="rounded-2xl border-b-4 border-violet-400 bg-violet-200 px-4 py-2 text-sm font-bold text-violet-900 transition hover:bg-violet-300 active:translate-y-0.5 active:border-b-2"
                >
                  🔄 Novo jogo
                </button>
              </div>

              <StarBar earned={starsEarned} total={exercises.length} />

              {allCorrect && (
                <div
                  role="status"
                  className="mt-4 animate-bounce-in rounded-2xl border-4 border-amber-400 bg-amber-100 px-4 py-4 text-center text-lg font-bold text-amber-900"
                >
                  🏆 Parabéns! Você ganhou todas as estrelas desta rodada!
                </div>
              )}

              <ul className="mt-6 space-y-4">
                {exercises.map((ex, index) => (
                  <li
                    key={ex.id}
                    className={`rounded-2xl border-4 p-4 transition-colors ${
                      ex.correct === true
                        ? "border-emerald-400 bg-emerald-50"
                        : ex.correct === false
                          ? "border-orange-300 bg-orange-50"
                          : "border-violet-100 bg-violet-50/50"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xl font-extrabold text-violet-800">
                        Desafio {index + 1}: {baseNumber} × {ex.multiplier} = ?
                      </p>
                      {ex.correct === true && (
                        <span className="text-3xl" aria-hidden>
                          ⭐
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={ex.answer}
                        onChange={(e) => updateAnswer(ex.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            checkAnswer(ex.id);
                          }
                        }}
                        placeholder="?"
                        aria-label={`Resposta para ${baseNumber} vezes ${ex.multiplier}`}
                        className="w-28 rounded-2xl border-4 border-violet-200 bg-white px-3 py-2 text-center text-2xl font-bold outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                      />
                      <button
                        type="button"
                        onClick={() => checkAnswer(ex.id)}
                        className="rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-600 active:translate-y-0.5 active:border-b-2"
                      >
                        Conferir ✓
                      </button>
                    </div>
                    {ex.checked && ex.praise && (
                      <p
                        role="status"
                        className={`mt-3 text-base font-bold ${
                          ex.correct
                            ? "text-emerald-700"
                            : "text-orange-700"
                        }`}
                      >
                        {ex.praise}
                        {ex.correct === false && (
                          <span className="mt-1 block font-medium">
                            A resposta certa é{" "}
                            <strong>{baseNumber * ex.multiplier}</strong>.
                            Você pode tentar de novo!
                          </span>
                        )}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
