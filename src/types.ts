export interface ProConItem {
  text: string;
  impact: number; // 1 to 5
  category: string;
  explanation: string;
}

export interface OptionAnalysis {
  optionName: string;
  pros: ProConItem[];
  cons: ProConItem[];
}

export interface StrategicActions {
  so: string;
  wo: string;
  st: string;
  wt: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategicActions: StrategicActions;
}

export interface ComparisonOption {
  optionName: string;
  scores: Record<string, number>;
  verdict: string;
}

export interface ComparisonAnalysis {
  criteriaList: string[];
  options: ComparisonOption[];
}

export interface NextStepItem {
  step: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
}

export interface SummaryVerdict {
  recommendedOption: string;
  tiebreakerFactor: string;
  confidenceLevel: "High" | "Medium" | "Low" | string;
  reasoning: string;
}

export interface DecisionDossier {
  dilemmaRestated: string;
  clarityScore: number;
  summaryVerdict: SummaryVerdict;
  prosCons: {
    options: OptionAnalysis[];
  };
  swot: SWOTAnalysis;
  comparison: ComparisonAnalysis;
  nextSteps: NextStepItem[];
}

export interface SavedDecision {
  id: string;
  title: string;
  timestamp: string;
  options: string[];
  dossier: DecisionDossier;
}
