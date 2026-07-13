import React from "react";
import { Scale, History, Sparkles } from "lucide-react";

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export default function Header({ onToggleHistory, historyCount }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg tracking-tighter text-white uppercase">
                THE TIEBREAKER
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                v2.4
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium hidden sm:block">
              Decision Engine <span className="text-indigo-400 font-semibold">• AI Analysis Active</span>
            </p>
          </div>
        </div>

        <button
          onClick={onToggleHistory}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all active:scale-98 relative shadow-sm"
          title="View saved decisions"
        >
          <History className="h-4 w-4 text-zinc-400" />
          <span className="hidden sm:inline">Decision History</span>
          {historyCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse border-2 border-zinc-950">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
