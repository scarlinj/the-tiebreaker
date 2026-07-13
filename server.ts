import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    }
  }
}) : null;

// API routes first
app.post("/api/analyze", async (req: express.Request, res: express.Response) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "Gemini API Key is not configured. Please add GEMINI_API_KEY in the Settings > Secrets menu."
      });
    }

    const { decision, options: userOptions } = req.body;

    if (!decision || typeof decision !== "string" || decision.trim() === "") {
      return res.status(400).json({ error: "A decision description is required." });
    }

    const prompt = `
      You are "The Tiebreaker", an elite decision-making consultant.
      The user is facing this decision: "${decision}"
      ${userOptions && Array.isArray(userOptions) && userOptions.length > 0 ? `The specific options being compared are: ${JSON.stringify(userOptions)}` : `Extract the 2-3 primary competing options from the decision question itself.`}

      Your task is to analyze this decision thoroughly and output a highly structured decision dossier in JSON format.
      Be objective, realistic, and highly practical. Provide constructive next steps and strategic insights.

      Ensure the output exactly matches the requested JSON schema. Make sure scores are numbers, clarityScore is a number, and impact values are numbers.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dilemmaRestated: {
              type: Type.STRING,
              description: "A professional, clear restatement of the core dilemma and trade-off."
            },
            clarityScore: {
              type: Type.INTEGER,
              description: "A score from 0 to 100 representing how clear-cut/straightforward the decision is (higher means more obvious choice, lower means highly ambiguous)."
            },
            summaryVerdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOption: { type: Type.STRING, description: "The recommended option recommended as the primary tiebreaker choice." },
                tiebreakerFactor: { type: Type.STRING, description: "The single most critical/pivotal factor that tipped the scales (the 'tiebreaker' metric)." },
                confidenceLevel: { type: Type.STRING, description: "Confidence level: 'High', 'Medium', or 'Low'." },
                reasoning: { type: Type.STRING, description: "A concise, persuasive synthesis of why this option is recommended over the others." }
              },
              required: ["recommendedOption", "tiebreakerFactor", "confidenceLevel", "reasoning"]
            },
            prosCons: {
              type: Type.OBJECT,
              properties: {
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      optionName: { type: Type.STRING, description: "The name of the option." },
                      pros: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            text: { type: Type.STRING, description: "Short bullet point summary (e.g. 'Lower initial cost')." },
                            impact: { type: Type.INTEGER, description: "Impact rating from 1 to 5 (1 = minor advantage, 5 = massive game-changer)." },
                            category: { type: Type.STRING, description: "Category tag (e.g., Financial, Career, Time, Quality of Life)." },
                            explanation: { type: Type.STRING, description: "A brief 1-2 sentence supporting explanation." }
                          },
                          required: ["text", "impact", "category", "explanation"]
                        }
                      },
                      cons: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            text: { type: Type.STRING, description: "Short bullet point summary (e.g. 'Steep learning curve')." },
                            impact: { type: Type.INTEGER, description: "Impact rating from 1 to 5 (1 = minor drawback, 5 = critical risk/dealbreaker)." },
                            category: { type: Type.STRING, description: "Category tag (e.g., Financial, Stress, Time, Complexity)." },
                            explanation: { type: Type.STRING, description: "A brief 1-2 sentence supporting explanation." }
                          },
                          required: ["text", "impact", "category", "explanation"]
                        }
                      }
                    },
                    required: ["optionName", "pros", "cons"]
                  }
                }
              },
              required: ["options"]
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Strengths of the situation or choice as a whole." },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Weaknesses or internal hurdles of the current situation." },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "External positive opportunities that arise from this decision." },
                threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "External threats, future risks, or obstacles that could derail things." },
                strategicActions: {
                  type: Type.OBJECT,
                  properties: {
                    so: { type: Type.STRING, description: "How to use strengths to maximize opportunities." },
                    wo: { type: Type.STRING, description: "How to leverage opportunities to overcome weaknesses." },
                    st: { type: Type.STRING, description: "How to deploy strengths to neutralize threats." },
                    wt: { type: Type.STRING, description: "How to minimize weaknesses and safeguard against threats." }
                  },
                  required: ["so", "wo", "st", "wt"]
                }
              },
              required: ["strengths", "weaknesses", "opportunities", "threats", "strategicActions"]
            },
            comparison: {
              type: Type.OBJECT,
              properties: {
                criteriaList: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3-5 standard criteria for comparing these options (e.g. ['Cost', 'Time Required', 'Complexity', 'Future Growth'])." },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      optionName: { type: Type.STRING, description: "The name of the option." },
                      scores: {
                        type: Type.OBJECT,
                        description: "Map of criteria names to score values from 1 (terrible) to 10 (perfect)."
                      },
                      verdict: { type: Type.STRING, description: "A brief criteria-specific takeaway for this option." }
                    },
                    required: ["optionName", "scores", "verdict"]
                  }
                }
              },
              required: ["criteriaList", "options"]
            },
            nextSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING, description: "A clear actionable task." },
                  priority: { type: Type.STRING, description: "Priority: 'High', 'Medium', or 'Low'." },
                  reason: { type: Type.STRING, description: "Why this step is critical to make or execute the decision." }
                },
                required: ["step", "priority", "reason"]
              }
            }
          },
          required: [
            "dilemmaRestated",
            "clarityScore",
            "summaryVerdict",
            "prosCons",
            "swot",
            "comparison",
            "nextSteps"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "Failed to generate decision dossier from Gemini." });
    }

    const dossier = JSON.parse(text);
    return res.json(dossier);
  } catch (error: any) {
    console.error("Error analyzing decision:", error);
    return res.status(500).json({
      error: error.message || "An error occurred during decision analysis."
    });
  }
});

// Serve frontend with Vite middleware in dev, and static files in prod
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
