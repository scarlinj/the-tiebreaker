import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import DecisionForm from "./components/DecisionForm";
import DossierDashboard from "./components/DossierDashboard";
import SavedDecisionsList from "./components/SavedDecisionsList";
import { DecisionDossier, SavedDecision } from "./types";
import { Scale, Compass, LayoutGrid } from "lucide-react";

export default function App() {
  const [decision, setDecision] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [dossier, setDossier] = useState<DecisionDossier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Load saved decisions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tiebreaker_saved_decisions");
      if (stored) {
        setSavedDecisions(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error loading saved decisions:", err);
    }
  }, []);

  // Save to history helper
  const saveDecisionToHistory = (dossierResult: DecisionDossier) => {
    try {
      // Build options array (use the generated ones from the dossier)
      const dossierOptions = dossierResult.prosCons.options.map((o) => o.optionName);

      const newSaved: SavedDecision = {
        id: Math.random().toString(36).substring(2, 9) + Date.now().toString(),
        title: decision.trim(),
        timestamp: new Date().toISOString(),
        options: dossierOptions,
        dossier: dossierResult
      };

      const updated = [newSaved, ...savedDecisions];
      setSavedDecisions(updated);
      localStorage.setItem("tiebreaker_saved_decisions", JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving decision:", err);
    }
  };

  const handleAddOption = (option: string) => {
    setOptions((prev) => [...prev, option]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!decision.trim()) return;

    setIsLoading(true);
    setError(null);
    setDossier(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          decision: decision.trim(),
          options: options.filter((o) => o.trim() !== "")
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze decision.");
      }

      setDossier(data);
      saveDecisionToHistory(data);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "An unexpected error occurred. Please check your network or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSavedDecision = (saved: SavedDecision) => {
    setDecision(saved.title);
    setOptions(saved.options);
    setDossier(saved.dossier);
    setError(null);
  };

  const handleDeleteSavedDecision = (id: string) => {
    const updated = savedDecisions.filter((item) => item.id !== id);
    setSavedDecisions(updated);
    localStorage.setItem("tiebreaker_saved_decisions", JSON.stringify(updated));
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire decision history?")) {
      setSavedDecisions([]);
      localStorage.removeItem("tiebreaker_saved_decisions");
    }
  };

  const handleReset = () => {
    setDecision("");
    setOptions([]);
    setDossier(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 text-zinc-300">
      <Header
        onToggleHistory={() => setHistoryOpen(!historyOpen)}
        historyCount={savedDecisions.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {dossier ? (
          <DossierDashboard dossier={dossier} onReset={handleReset} />
        ) : (
          <DecisionForm
            decision={decision}
            onChangeDecision={setDecision}
            options={options}
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            error={error}
          />
        )}
      </main>

      {/* History Slide-Over Drawer */}
      <SavedDecisionsList
        savedDecisions={savedDecisions}
        onSelect={handleSelectSavedDecision}
        onDelete={handleDeleteSavedDecision}
        onClearAll={handleClearAllHistory}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
          <p>© 2026 The Tiebreaker. Designed for pristine clarity, built on the Bento Grid.</p>
        </div>
      </footer>
    </div>
  );
}
