import React from "react";
import { SavedDecision } from "../types";
import { X, Trash2, Calendar, Scale, ChevronRight, Sparkles } from "lucide-react";

interface SavedDecisionsListProps {
  savedDecisions: SavedDecision[];
  onSelect: (decision: SavedDecision) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedDecisionsList({
  savedDecisions,
  onSelect,
  onDelete,
  onClearAll,
  isOpen,
  onClose
}: SavedDecisionsListProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop filter overlay */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md transform bg-zinc-950 border-l border-zinc-800 shadow-2xl transition-all duration-300 animate-slide-over">
            <div className="flex h-full flex-col overflow-y-scroll bg-zinc-950">
              {/* Header */}
              <div className="border-b border-zinc-850 px-6 py-5 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/25">
                    <Scale className="h-4 w-4 text-indigo-400" />
                  </div>
                  <h2 className="text-base font-bold font-display text-white uppercase tracking-tight" id="slide-over-title">
                    Decision Archive
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all outline-none border border-transparent hover:border-zinc-700/50"
                >
                  <span className="sr-only">Close panel</span>
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 px-6 py-6 space-y-6 bg-zinc-950">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">
                    {savedDecisions.length} Saved Analysis{savedDecisions.length !== 1 ? "es" : ""}
                  </span>
                  {savedDecisions.length > 0 && (
                    <button
                      onClick={onClearAll}
                      className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-all py-1 px-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 uppercase tracking-wider font-mono hover:bg-rose-500/20"
                    >
                      Clear Archive
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {savedDecisions.map((item) => {
                    // Extract date format
                    const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    });

                    return (
                      <div
                        key={item.id}
                        className="group relative border border-zinc-800 hover:border-indigo-500/50 rounded-xl p-4 hover:shadow-[0_0_12px_rgba(99,102,241,0.15)] transition-all cursor-pointer bg-zinc-900/40 hover:bg-zinc-900/80"
                        onClick={() => {
                          onSelect(item);
                          onClose();
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1 font-mono tracking-wider">
                              <Calendar className="h-3 w-3 text-zinc-500" /> {dateStr}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item.id);
                              }}
                              className="text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg"
                              title="Delete from archive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <h3 className="text-sm font-bold text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors pr-6">
                            {item.title}
                          </h3>

                          {/* Options indicators */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.options.map((opt, oIdx) => (
                              <span
                                key={oIdx}
                                className="inline-block px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[9px] font-mono font-bold text-zinc-400 truncate max-w-[120px]"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>

                          {/* Recommendation badge */}
                          {item.dossier?.summaryVerdict?.recommendedOption && (
                            <div className="pt-2.5 border-t border-zinc-800/60 mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-indigo-400 bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10">
                              <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
                              <span className="text-zinc-500 font-bold font-mono uppercase text-[9px]">Verdict:</span>
                              <span className="truncate flex-1 font-bold text-zinc-200">
                                {item.dossier.summaryVerdict.recommendedOption}
                              </span>
                              <ChevronRight className="h-3.5 w-3.5 text-indigo-400/70 group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {savedDecisions.length === 0 && (
                    <div className="text-center py-16 px-4 space-y-4 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
                      <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                        <Scale className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-zinc-300 text-sm uppercase tracking-wider font-mono">No Saved Dilemmas</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto font-medium">
                          Decisions you analyze will appear in this archive so you can review or recalibrate them at any time.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
