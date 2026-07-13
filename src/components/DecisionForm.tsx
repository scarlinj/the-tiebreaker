import React, { useState, useEffect } from "react";
import { Plus, X, Sparkles, Scale, AlertCircle, ArrowRight, Lightbulb, HelpCircle } from "lucide-react";

interface DecisionFormProps {
  decision: string;
  onChangeDecision: (val: string) => void;
  options: string[];
  onAddOption: (option: string) => void;
  onRemoveOption: (index: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

const PRESETS = [
  {
    title: "Buy Tesla Model Y vs. Honda CR-V",
    text: "Should I buy a Tesla Model Y or a Honda CR-V Hybrid for my daily commute?",
    options: ["Tesla Model Y", "Honda CR-V Hybrid"],
    icon: "🚗"
  },
  {
    title: "Startup Offer vs. Stable Job",
    text: "Should I accept a high-risk senior engineer offer at an early-stage AI startup or stay at my stable corporate engineering manager job?",
    options: ["AI Startup Offer", "Stable Corporate Role"],
    icon: "💼"
  },
  {
    title: "Learn Rust vs. Python",
    text: "Which programming language should I invest time learning in 2026: Rust or Python?",
    options: ["Rust", "Python"],
    icon: "💻"
  },
  {
    title: "Suburban Home vs. City Flat",
    text: "Should we sell our downtown city apartment and purchase a larger suburban single-family home to start a family?",
    options: ["Downtown Apartment", "Suburban Family Home"],
    icon: "🏡"
  }
];

const LOADING_STEPS = [
  "Structuring decision framework...",
  "Running SWOT quadrant heuristics...",
  "Calibrating criteria scorecards...",
  "Formulating critical tiebreaker recommendations..."
];

export default function DecisionForm({
  decision,
  onChangeDecision,
  options,
  onAddOption,
  onRemoveOption,
  onSubmit,
  isLoading,
  error
}: DecisionFormProps) {
  const [newOption, setNewOption] = useState("");
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAddOptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOption.trim()) {
      if (options.some(o => o.toLowerCase() === newOption.trim().toLowerCase())) {
        setNewOption("");
        return;
      }
      onAddOption(newOption.trim());
      setNewOption("");
    }
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    onChangeDecision(preset.text);
    // Clear current options first, then load preset options
    options.forEach((_, i) => onRemoveOption(0));
    preset.options.forEach(opt => onAddOption(opt));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-white leading-tight">
          Stuck on a tough decision?
          <span className="block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Let's break the tie.
          </span>
        </h1>
        <p className="text-base text-zinc-400 leading-relaxed">
          Input your dilemma. Our AI analyzer breaks down your options with visual scorecards, SWOT quadrants, and deep-dive trade-off matrices to give you logical clarity.
        </p>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden max-w-3xl mx-auto">
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-950/20 border border-red-800/50 rounded-xl text-red-300 flex items-start gap-3 text-sm animate-shake">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-semibold text-red-200">Analysis Failed</p>
                <p className="mt-0.5 text-red-300/80">{error}</p>
              </div>
            </div>
          )}

          {/* Question Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="decision-text" className="block text-sm font-semibold text-zinc-200">
                1. What decision are you trying to make?
              </label>
              <span className="text-xs text-zinc-500 font-mono">SPECIFY KEY DILEMMA</span>
            </div>
            <textarea
              id="decision-text"
              rows={3}
              value={decision}
              onChange={(e) => onChangeDecision(e.target.value)}
              placeholder="e.g., Should I buy a Tesla Model Y or a Honda CR-V Hybrid? Or should we expand our product team or invest in marketing next quarter?"
              className="w-full px-4 py-3 rounded-xl border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-zinc-950 text-zinc-100 placeholder-zinc-500 transition-all text-sm outline-none resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Options input */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-zinc-200">
                2. Specify the options (Optional)
              </label>
              <p className="text-xs text-zinc-500 mt-0.5">
                Add the primary alternatives you are choosing between.
              </p>
            </div>

            <form onSubmit={handleAddOptionSubmit} className="flex gap-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="e.g., Option Name"
                disabled={isLoading}
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-zinc-950 text-zinc-100 placeholder-zinc-500 transition-all text-sm outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !newOption.trim()}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-950 disabled:text-zinc-600 disabled:border-zinc-900 border border-zinc-700 text-zinc-200 font-medium text-sm flex items-center gap-1.5 transition-all"
              >
                <Plus className="h-4 w-4" /> Add Option
              </button>
            </form>

            {/* List of current options */}
            <div className="flex flex-wrap gap-2 pt-1">
              {options.map((opt, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 font-medium text-xs shadow-sm hover:border-indigo-500/50 transition-all group"
                >
                  <span>{opt}</span>
                  {!isLoading && (
                    <button
                      type="button"
                      onClick={() => onRemoveOption(idx)}
                      className="text-indigo-400 hover:text-indigo-200 p-0.5 rounded-full hover:bg-indigo-900/50 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}

              {options.length === 0 && (
                <div className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200 text-xs font-medium">
                  <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Auto-Extract Mode:</strong> If you leave options blank, our AI will automatically identify the key options from your question text!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              onClick={onSubmit}
              disabled={isLoading || !decision.trim()}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none text-white font-bold text-base shadow-[0_0_25px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer"
            >
              {isLoading ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="font-semibold">Analyzing trade-offs...</span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-200 tracking-wide animate-pulse">
                    {LOADING_STEPS[loadingStepIndex]}
                  </span>
                </div>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 animate-pulse text-indigo-200" />
                  <span>Generate Complete Decision Dossier</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform text-indigo-200" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preset section */}
      {!isLoading && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-2 px-2">
            <HelpCircle className="h-4 w-4 text-zinc-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
              Need inspiration? Try one of these classic dilemmas
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => loadPreset(preset)}
                className="text-left p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-700 shadow-md hover:shadow-lg active:scale-99 transition-all flex gap-3 group"
              >
                <span className="text-2xl p-2 bg-zinc-950 rounded-lg group-hover:bg-zinc-900 transition-colors shrink-0">{preset.icon}</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {preset.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
