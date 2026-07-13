import React, { useState } from "react";
import {
  DecisionDossier,
  ProConItem,
  OptionAnalysis,
  SWOTAnalysis,
  ComparisonAnalysis,
  NextStepItem
} from "../types";
import {
  Sparkles,
  ArrowLeft,
  ThumbsUp,
  Scale,
  Compass,
  LayoutGrid,
  Trophy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap,
  TrendingUp,
  Shield,
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkle,
  Check
} from "lucide-react";

interface DossierDashboardProps {
  dossier: DecisionDossier;
  onReset: () => void;
}

type TabType = "summary" | "pros_cons" | "swot" | "comparison" | "next_steps";

export default function DossierDashboard({ dossier, onReset }: DossierDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [isApproved, setIsApproved] = useState(false);

  const toggleItem = (key: string) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleApprovePath = () => {
    setIsApproved(true);
    setActiveTab("next_steps");
    // Scroll to top of dashboard panel
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to find the Pros & Cons of the recommended option for the Bento grid
  const getRecommendedOptionProsCons = () => {
    const recommendedOptName = dossier.summaryVerdict.recommendedOption;
    const matchedOpt = dossier.prosCons.options.find(
      (o) =>
        o.optionName.toLowerCase().includes(recommendedOptName.toLowerCase()) ||
        recommendedOptName.toLowerCase().includes(o.optionName.toLowerCase())
    );
    return matchedOpt || dossier.prosCons.options[0] || { optionName: "Recommended Option", pros: [], cons: [] };
  };

  const targetOpt = getRecommendedOptionProsCons();

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-16">
      {/* Back & Action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>New Decision Analysis</span>
        </button>
        <span className="text-xs text-zinc-500 font-mono">
          MODEL: GEMINI-3.5-FLASH <span className="text-indigo-400">• SECURE BACKEND ACTIVE</span>
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold font-mono">
              <Scale className="h-3.5 w-3.5 animate-pulse" /> CORE DILEMMA RESTATED
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight uppercase">
              {dossier.dilemmaRestated}
            </h2>
          </div>

          {/* Clarity score circle */}
          <div className="flex items-center gap-4 bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl shrink-0 self-stretch sm:self-auto justify-center">
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="stroke-zinc-800"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="stroke-indigo-500 transition-all duration-1000 ease-out"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - dossier.clarityScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-base font-black font-mono text-white">
                {dossier.clarityScore}%
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Clarity Index
              </p>
              <p className="text-sm font-semibold text-zinc-300">
                {dossier.clarityScore >= 70
                  ? "Highly Clear-cut"
                  : dossier.clarityScore >= 40
                  ? "Moderate Trade-offs"
                  : "Deep Dilemma"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 overflow-x-auto scrollbar-none bg-zinc-950/20">
          {(
            [
              { id: "summary", label: "Verdict Summary", icon: Compass },
              { id: "pros_cons", label: "Pros & Cons Matrix", icon: Scale },
              { id: "swot", label: "SWOT Analysis", icon: LayoutGrid },
              { id: "comparison", label: "Criteria Scorecard", icon: Trophy },
              { id: "next_steps", label: "Action Checklist", icon: CheckCircle2 }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-xs uppercase tracking-widest font-bold border-b-2 whitespace-nowrap transition-all outline-none ${
                  active
                    ? "border-indigo-500 text-indigo-400 bg-zinc-950/40"
                    : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-indigo-400" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      {isApproved && activeTab === "next_steps" && (
        <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-indigo-300 flex items-center gap-3 text-sm animate-fade-in shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <Sparkle className="h-5 w-5 text-indigo-400 animate-spin" />
          <div>
            <span className="font-semibold text-white">Recommended Path Approved!</span> We've locked in the action steps to begin executing this choice.
          </div>
        </div>
      )}

      {/* TAB CONTENT PANELS */}
      <div className="transition-all duration-200">
        {/* TAB 1: VERDICT SUMMARY (The Core Bento Grid) */}
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* 1. Pros & Cons (Left Column - col-span-3 row-span-4) */}
            <div className="col-span-1 lg:col-span-3 lg:row-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono">Pros & Cons</h2>
                <span className="text-[10px] bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 truncate max-w-[120px] font-mono">
                  {targetOpt.optionName}
                </span>
              </div>
              <div className="space-y-4 overflow-hidden flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-green-400 text-[10px] font-black tracking-wider uppercase mb-2">Top Pros</h3>
                  <ul className="text-xs space-y-2 text-zinc-300">
                    {targetOpt.pros.slice(0, 3).map((p, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-green-400 shrink-0">•</span>
                        <span className="leading-tight line-clamp-2">{p.text}</span>
                      </li>
                    ))}
                    {targetOpt.pros.length === 0 && (
                      <li className="text-zinc-500 italic">No major pros listed</li>
                    )}
                  </ul>
                </div>
                <div className="pt-3 border-t border-zinc-800">
                  <h3 className="text-red-400 text-[10px] font-black tracking-wider uppercase mb-2">Top Cons</h3>
                  <ul className="text-xs space-y-2 text-zinc-300">
                    {targetOpt.cons.slice(0, 3).map((c, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-red-400 shrink-0">•</span>
                        <span className="leading-tight line-clamp-2">{c.text}</span>
                      </li>
                    ))}
                    {targetOpt.cons.length === 0 && (
                      <li className="text-zinc-500 italic">No major cons listed</li>
                    )}
                  </ul>
                </div>
                <button
                  onClick={() => setActiveTab("pros_cons")}
                  className="mt-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider text-left flex items-center gap-1 group"
                >
                  View complete matrix <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* 2. Comparison Matrix (Center Top - col-span-6 row-span-3) */}
            <div className="col-span-1 lg:col-span-6 lg:row-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono">Comparison Matrix</h2>
                  <span className="bg-zinc-950 text-[9px] px-2 py-0.5 rounded border border-zinc-800 text-zinc-400 font-mono italic">
                    {dossier.comparison.criteriaList.length} metrics
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800">
                        <th className="pb-2 font-bold font-mono uppercase tracking-wider">Factor</th>
                        {dossier.comparison.options.map((o, idx) => (
                          <th key={idx} className="pb-2 text-right font-bold text-zinc-300 truncate max-w-[100px]">
                            {o.optionName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300 divide-y divide-zinc-800/30">
                      {dossier.comparison.criteriaList.slice(0, 4).map((crit, idx) => {
                        const scores = dossier.comparison.options.map((o) => o.scores[crit] || 0);
                        const maxScore = Math.max(...scores);

                        return (
                          <tr key={idx} className="hover:bg-zinc-850/50 transition-colors">
                            <td className="py-2.5 font-medium text-zinc-400">{crit}</td>
                            {dossier.comparison.options.map((opt, optIdx) => {
                              const score = opt.scores[crit] || 0;
                              const isWinner = score === maxScore && score > 0;
                              return (
                                <td key={optIdx} className={`py-2.5 text-right font-bold font-mono ${isWinner ? 'text-indigo-400' : 'text-zinc-500'}`}>
                                  {score}/10
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("comparison")}
                className="mt-3 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider text-left flex items-center gap-1 group"
              >
                Inspect detailed scorecard <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* 3. AI Recommendation Spotlight (Right Column - col-span-3 row-span-6) */}
            <div className="col-span-1 lg:col-span-3 lg:row-span-6 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.05)]">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Trophy className="h-40 w-40" />
              </div>
              
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-indigo-400/40">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">AI TIEBREAKER</h2>
                <p className="text-xs text-indigo-200/60 leading-tight">Statistical recommendation leans toward</p>
                <p className="text-2xl lg:text-3xl font-black text-white mt-3 tracking-tighter uppercase leading-none drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  {dossier.summaryVerdict.recommendedOption}
                </p>
                <div className="inline-block mt-2 px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[9px] font-bold font-mono uppercase tracking-widest border border-indigo-500/20">
                  Confidence: {dossier.summaryVerdict.confidenceLevel}
                </div>
              </div>
              
              <div className="mt-2 w-full bg-zinc-950/60 rounded-xl p-3.5 text-left border border-zinc-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1 font-mono flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Core Pivot Factor
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  "{dossier.summaryVerdict.tiebreakerFactor}"
                </p>
              </div>
              
              <button
                onClick={handleApprovePath}
                className="mt-3 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-900/40 active:scale-98 transition-all cursor-pointer border border-indigo-400/20 flex items-center justify-center gap-1.5"
              >
                <Check className="h-4 w-4 stroke-[3]" /> Approve Path
              </button>
            </div>

            {/* 4. SWOT Analysis (Center Bottom - col-span-6 row-span-3) */}
            <div className="col-span-1 lg:col-span-6 lg:row-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 font-mono">SWOT Analysis Summary</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800">
                    <p className="text-[9px] font-black text-green-400 mb-1 tracking-widest uppercase font-mono">STRENGTHS</p>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-tight">
                      {dossier.swot.strengths[0] || "No internal strengths defined."}
                    </p>
                  </div>
                  <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800">
                    <p className="text-[9px] font-black text-rose-400 mb-1 tracking-widest uppercase font-mono">WEAKNESSES</p>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-tight">
                      {dossier.swot.weaknesses[0] || "No internal limits defined."}
                    </p>
                  </div>
                  <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800">
                    <p className="text-[9px] font-black text-indigo-400 mb-1 tracking-widest uppercase font-mono">OPPORTUNITIES</p>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-tight">
                      {dossier.swot.opportunities[0] || "No external catalysts defined."}
                    </p>
                  </div>
                  <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800">
                    <p className="text-[9px] font-black text-amber-400 mb-1 tracking-widest uppercase font-mono">THREATS</p>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-tight">
                      {dossier.swot.threats[0] || "No future risks defined."}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("swot")}
                className="mt-3 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider text-left flex items-center gap-1 group"
              >
                Explore strategic actions <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* 5. Personal Alignment (Left Bottom - col-span-3 row-span-2) */}
            <div className="col-span-1 lg:col-span-3 lg:row-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono">Personal Alignment</h2>
              <div className="flex items-end gap-2 my-2">
                <span className="text-4xl font-light text-white tracking-tighter leading-none">{dossier.clarityScore}%</span>
                <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-black tracking-widest font-mono">MATCH</span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                <div
                  className="bg-indigo-500 h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-1000"
                  style={{ width: `${dossier.clarityScore}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 font-medium leading-tight">
                Data matches your analytical criteria with a {dossier.clarityScore}% confidence coefficient.
              </p>
            </div>

          </div>
        )}

        {/* TAB 2: PROS & CONS (DETAILED VIEW) */}
        {activeTab === "pros_cons" && (
          <div className="space-y-8 animate-fade-in">
            {dossier.prosCons.options.map((opt, optIdx) => (
              <div
                key={optIdx}
                className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden"
              >
                <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">
                    Option: <span className="text-indigo-400">{opt.optionName}</span>
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono uppercase tracking-widest">
                    <span>{opt.pros.length} Pros</span>
                    <span>•</span>
                    <span>{opt.cons.length} Cons</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                  {/* PROS (Green accent) */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-green-400 border-b border-zinc-800 pb-2.5">
                      <ThumbsUp className="h-5 w-5" />
                      <span className="text-xs font-black uppercase tracking-wider font-mono">
                        Advantages / Pros
                      </span>
                    </div>

                    <div className="space-y-3">
                      {opt.pros.map((pro, idx) => {
                        const itemKey = `pro-${optIdx}-${idx}`;
                        const expanded = expandedItems[itemKey];
                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/50 hover:border-zinc-700 transition-all space-y-2.5 cursor-pointer"
                            onClick={() => toggleItem(itemKey)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1.5 flex-1">
                                <span className="inline-block px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[9px] font-bold border border-green-500/20 uppercase tracking-wider font-mono">
                                  {pro.category}
                                </span>
                                <h4 className="text-sm font-bold text-zinc-200 leading-snug">
                                  {pro.text}
                                </h4>
                              </div>

                              {/* Impact level meter */}
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="text-[9px] text-zinc-500 font-bold uppercase font-mono tracking-wider">
                                  Impact
                                </span>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((level) => (
                                    <span
                                      key={level}
                                      className={`h-2 w-2.5 rounded-xs ${
                                        level <= pro.impact
                                          ? "bg-green-400"
                                          : "bg-zinc-800"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Dropdown context */}
                            <div
                              className={`text-xs text-zinc-400 border-t border-zinc-800/80 pt-2 flex items-start gap-1 justify-between transition-all ${
                                expanded ? "block" : "hidden"
                              }`}
                            >
                              <span className="leading-relaxed">{pro.explanation}</span>
                            </div>

                            <div className="flex justify-center text-zinc-500 hover:text-zinc-300 transition-colors">
                              {expanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {opt.pros.length === 0 && (
                        <p className="text-sm text-zinc-500 italic text-center py-6">
                          No significant advantages identified.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CONS (Red/Rose accent) */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-rose-400 border-b border-zinc-800 pb-2.5">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="text-xs font-black uppercase tracking-wider font-mono">
                        Risks & Drawbacks / Cons
                      </span>
                    </div>

                    <div className="space-y-3">
                      {opt.cons.map((con, idx) => {
                        const itemKey = `con-${optIdx}-${idx}`;
                        const expanded = expandedItems[itemKey];
                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/50 hover:border-zinc-700 transition-all space-y-2.5 cursor-pointer"
                            onClick={() => toggleItem(itemKey)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1.5 flex-1">
                                <span className="inline-block px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[9px] font-bold border border-rose-500/20 uppercase tracking-wider font-mono">
                                  {con.category}
                                </span>
                                <h4 className="text-sm font-bold text-zinc-200 leading-snug">
                                  {con.text}
                                </h4>
                              </div>

                              {/* Impact level meter */}
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="text-[9px] text-zinc-500 font-bold uppercase font-mono tracking-wider">
                                  Impact
                                </span>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((level) => (
                                    <span
                                      key={level}
                                      className={`h-2 w-2.5 rounded-xs ${
                                        level <= con.impact
                                          ? "bg-rose-400"
                                          : "bg-zinc-800"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Dropdown context */}
                            <div
                              className={`text-xs text-zinc-400 border-t border-zinc-800/80 pt-2 flex items-start gap-1 justify-between transition-all ${
                                expanded ? "block" : "hidden"
                              }`}
                            >
                              <span className="leading-relaxed">{con.explanation}</span>
                            </div>

                            <div className="flex justify-center text-zinc-500 hover:text-zinc-300 transition-colors">
                              {expanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {opt.cons.length === 0 && (
                        <p className="text-sm text-zinc-500 italic text-center py-6">
                          No significant drawbacks identified.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SWOT ANALYSIS (DETAILED VIEW) */}
        {activeTab === "swot" && (
          <div className="space-y-8 animate-fade-in">
            {/* SWOT Quadrant Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* STRENGTHS */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 text-green-400 border-b border-zinc-800 pb-3">
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <ThumbsUp className="h-4.5 w-4.5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-white uppercase tracking-tight">
                      Strengths (S)
                    </h3>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                      Internal Advantages
                    </p>
                  </div>
                </div>
                <ul className="space-y-3.5">
                  {dossier.swot.strengths.map((str, idx) => (
                    <li key={idx} className="flex gap-2.5 text-sm text-zinc-300 leading-relaxed">
                      <span className="text-green-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WEAKNESSES */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 text-rose-400 border-b border-zinc-800 pb-3">
                  <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-white uppercase tracking-tight">
                      Weaknesses (W)
                    </h3>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                      Internal Limits & Hurdles
                    </p>
                  </div>
                </div>
                <ul className="space-y-3.5">
                  {dossier.swot.weaknesses.map((str, idx) => (
                    <li key={idx} className="flex gap-2.5 text-sm text-zinc-300 leading-relaxed">
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* OPPORTUNITIES */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 text-indigo-400 border-b border-zinc-800 pb-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <TrendingUp className="h-4.5 w-4.5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-white uppercase tracking-tight">
                      Opportunities (O)
                    </h3>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                      External Catalysts
                    </p>
                  </div>
                </div>
                <ul className="space-y-3.5">
                  {dossier.swot.opportunities.map((str, idx) => (
                    <li key={idx} className="flex gap-2.5 text-sm text-zinc-300 leading-relaxed">
                      <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* THREATS */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 text-amber-400 border-b border-zinc-800 pb-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Shield className="h-4.5 w-4.5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-white uppercase tracking-tight">
                      Threats (T)
                    </h3>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                      External Future Risks
                    </p>
                  </div>
                </div>
                <ul className="space-y-3.5">
                  {dossier.swot.threats.map((str, idx) => (
                    <li key={idx} className="flex gap-2.5 text-sm text-zinc-300 leading-relaxed">
                      <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Strategic TOWS matrix */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
              <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center gap-2">
                <Compass className="h-5 w-5 text-indigo-400" />
                <h3 className="font-display font-bold text-base text-white uppercase">
                  Strategic TOWS Synthesis
                </h3>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                <div className="space-y-5 pb-5 md:pb-0">
                  {/* SO */}
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20 font-mono tracking-wider">
                      STRENGTHS + OPPORTUNITIES (S-O)
                    </span>
                    <p className="text-xs text-zinc-400 font-medium">
                      How can you use your internal strengths to capitalize on opportunities?
                    </p>
                    <p className="text-sm text-zinc-200 leading-relaxed pt-1 font-semibold">
                      {dossier.swot.strategicActions.so}
                    </p>
                  </div>

                  {/* WO */}
                  <div className="space-y-1.5 pt-4 border-t border-zinc-800">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20 font-mono tracking-wider">
                      WEAKNESSES + OPPORTUNITIES (W-O)
                    </span>
                    <p className="text-xs text-zinc-400 font-medium">
                      How can you take advantage of opportunities to shore up internal weaknesses?
                    </p>
                    <p className="text-sm text-zinc-200 leading-relaxed pt-1 font-semibold">
                      {dossier.swot.strategicActions.wo}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 pt-5 md:pt-0 md:pl-6">
                  {/* ST */}
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20 font-mono tracking-wider">
                      STRENGTHS + THREATS (S-T)
                    </span>
                    <p className="text-xs text-zinc-400 font-medium">
                      How can you deploy your strengths to dodge or neutralize external threats?
                    </p>
                    <p className="text-sm text-zinc-200 leading-relaxed pt-1 font-semibold">
                      {dossier.swot.strategicActions.st}
                    </p>
                  </div>

                  {/* WT */}
                  <div className="space-y-1.5 pt-4 border-t border-zinc-800">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20 font-mono tracking-wider">
                      WEAKNESSES + THREATS (W-T)
                    </span>
                    <p className="text-xs text-zinc-400 font-medium">
                      How can you minimize weaknesses to protect against incoming external risks?
                    </p>
                    <p className="text-sm text-zinc-200 leading-relaxed pt-1 font-semibold">
                      {dossier.swot.strategicActions.wt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OPTIONS SCORECARD / COMPARISON TABLE */}
        {activeTab === "comparison" && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-indigo-400" />
              <h3 className="font-display font-bold text-base text-white uppercase">
                Decision Metrics Scorecard
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/40">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 w-1/3 font-mono">
                      Comparison Metric
                    </th>
                    {dossier.comparison.options.map((opt, idx) => (
                      <th
                        key={idx}
                        className="p-4 text-sm font-bold text-white text-center w-1/3"
                      >
                        {opt.optionName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {dossier.comparison.criteriaList.map((crit, critIdx) => {
                    // Find highest score in this criterion
                    const scores = dossier.comparison.options.map((o) => o.scores[crit] || 0);
                    const maxScore = Math.max(...scores);

                    return (
                      <tr key={critIdx} className="hover:bg-zinc-950/20 transition-colors">
                        <td className="p-4 text-sm font-semibold text-zinc-300">{crit}</td>
                        {dossier.comparison.options.map((opt, optIdx) => {
                          const score = opt.scores[crit] || 0;
                          const isWinner = score === maxScore && score > 0;
                          return (
                            <td key={optIdx} className="p-4 text-center">
                              <div className="flex flex-col items-center gap-1.5 max-w-[140px] mx-auto">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`font-mono text-sm font-bold ${
                                      isWinner ? "text-indigo-400" : "text-zinc-500"
                                    }`}
                                  >
                                    {score}/10
                                  </span>
                                  {isWinner && (
                                    <span
                                      className="text-[9px] font-bold bg-indigo-500/10 text-indigo-400 px-1.5 py-0.2 rounded border border-indigo-500/20 font-mono tracking-wide"
                                      title="Metric Leader"
                                    >
                                      LEAD
                                    </span>
                                  )}
                                </div>

                                {/* Custom scorecard progress bar */}
                                <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      isWinner ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-zinc-700"
                                    }`}
                                    style={{ width: `${score * 10}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                  {/* Verdict Row */}
                  <tr className="bg-zinc-950/30">
                    <td className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                      Criteria Verdict
                    </td>
                    {dossier.comparison.options.map((opt, optIdx) => {
                      const totalScore = dossier.comparison.criteriaList.reduce(
                        (acc, crit) => acc + (opt.scores[crit] || 0),
                        0
                      );
                      const avgScore = (
                        totalScore / dossier.comparison.criteriaList.length
                      ).toFixed(1);

                      return (
                        <td key={optIdx} className="p-4 space-y-2 text-center align-top">
                          <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider font-mono">
                            Aggregate: <span className="font-mono font-bold text-indigo-400 text-sm">{avgScore} avg</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 rounded-xl p-3.5 border border-zinc-800 shadow-sm max-w-[200px] mx-auto font-medium">
                            {opt.verdict}
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ACTION PLAN / NEXT STEPS */}
        {activeTab === "next_steps" && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-400 animate-pulse" />
                <h3 className="font-display font-bold text-base text-white uppercase">
                  Recommended Next Steps
                </h3>
              </div>
              <span className="text-xs font-bold text-zinc-400 font-mono">
                {Object.keys(checkedSteps).filter((k) => checkedSteps[parseInt(k)]).length} OF{" "}
                {dossier.nextSteps.length} COMPLETE
              </span>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-zinc-400">
                Follow this checklist of recommended, priority-graded actions to finalize your decision confidently.
              </p>

              <div className="divide-y divide-zinc-800/80">
                {dossier.nextSteps.map((item, idx) => {
                  const isChecked = checkedSteps[idx] || false;
                  const priorityColors = {
                    High: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    Low: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  };
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`py-4 flex gap-4 items-start cursor-pointer transition-colors ${
                        isChecked ? "opacity-40" : "hover:bg-zinc-950/20"
                      } ${idx === 0 ? "pt-0" : ""} ${
                        idx === dossier.nextSteps.length - 1 ? "pb-0" : ""
                      }`}
                    >
                      <button className="pt-0.5 shrink-0 focus:outline-none cursor-pointer">
                        <div
                          className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                            isChecked
                              ? "bg-indigo-600 border-indigo-500 text-white"
                              : "border-zinc-700 hover:border-indigo-500 bg-zinc-950"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                      </button>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider font-mono ${
                              priorityColors[item.priority] || priorityColors.Medium
                            }`}
                          >
                            {item.priority}
                          </span>
                          <h4
                            className={`text-sm font-bold text-zinc-200 leading-tight ${
                              isChecked ? "line-through text-zinc-500" : ""
                            }`}
                          >
                            {item.step}
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-medium">{item.reason}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Strategic Closing Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-white text-sm uppercase font-mono tracking-tight">Need to recalculate details?</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">
            You can always return to adjust your dilemma parameters or input specific target alternatives.
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-900/30 active:scale-98 shrink-0 transition-all cursor-pointer border border-indigo-400/20"
        >
          <span>Recalibrate Dilemma</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
