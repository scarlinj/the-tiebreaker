# ⚖️ The Tiebreaker — Decision Engine

**The Tiebreaker** is a professional, high-fidelity full-stack decision analysis platform designed to help founders, product owners, and professionals cut through analysis paralysis. Operating in an elegant, high-contrast Bento Grid aesthetic, it uses the advanced intelligence of Gemini-3.5-Flash to transform highly ambiguous, multi-variable decisions into beautifully structured, actionable decision dossiers.

Whether comparing strategic directions (such as offering free software with premium upgrades vs. a $20/month flat rate) or life-altering personal dilemmas, **The Tiebreaker** acts as your elite consultant to objectively weigh trade-offs and deliver a clear, logical recommendation.

---

## 🚀 Walkthrough of Features

### 1. Interactive Dilemma Intake
- **Targeted Formulation**: Formulate your main dilemma (e.g., *"Should I offer my software for free with paid features, or charge a $20/month premium plan?"*).
- **Explicit Option Mapping**: Explicitly list the options you are weighing (e.g., `"Option A: Freemium"`, `"Option B: Flat Premium"`), or let the AI automatically extract the natural competing choices directly from your description.
- **Instant Processing**: Triggers a server-safe, real-time structured analysis on submit.

### 2. High-Fidelity Bento Grid Dashboard
Once analyzed, your dilemma is rendered across a custom, unified Bento Dashboard, structured to show macro conclusions alongside microscopic deep-dives:
- **Decision Clarity Score**: A dynamic meter ranging from `0` to `100` that evaluates the degree of ambiguity, helping you recognize how clear-cut or complex your trade-offs are.
- **The Core Recommendation**: A prominent hero block displaying the **Recommended Option**, supported by the **Tiebreaker Metric** (the single pivotal factor that tipped the scales) and confidence levels.
- **Comprehensive Pros & Cons**: High-contrast, interactive cards displaying advantage and disadvantage lists for each option, scored with *Impact Ratings* (1 to 5) and contextual explanations.
- **SWOT Quadrant & Tactical Matrix**: A traditional four-quadrant SWOT matrix paired with custom strategic playbooks:
  - *SO (Strengths-Opportunities)*: How to leverage strengths to maximize opportunities.
  - *WO (Weaknesses-Opportunities)*: How to leverage opportunities to overcome hurdles.
  - *ST (Strengths-Threats)*: Deploying strengths to neutralize threats.
  - *WT (Weaknesses-Threats)*: Minimizing vulnerability and safeguarding progress.
- **Comparative Multi-Criteria Grid**: A radar-like evaluation table scoring options from `1` (least effective) to `10` (ideal) across dynamically generated criteria (such as *Customer Acquisition Cost*, *LTV*, and *Time to Revenue*).
- **Actionable Next Steps**: A segmented checklist categorized by priority levels (**High**, **Medium**, **Low**), highlighting immediate tasks and the underlying reasoning to build immediate execution momentum.

### 3. Persistent Decision Archive
- **Sidebar Slide-Over**: Store and recall previous dilemmas seamlessly via a fully-featured archive drawer.
- **Local Persistence**: Saves all generated decision dossiers locally in the browser so you can return to recalibrate your plans, compare previous recommendations, or delete stale archives.

---

## 🛠️ Technical Architecture

- **Frontend**: Single Page Application built on **React 18** and **Vite**, utilizing **Tailwind CSS** for the high-contrast slate-dark theme.
- **Backend**: **Express (Node.js)** server serving as a secure middleware layer to safeguard API credentials and safely communicate with external microservices.
- **AI Orchestration**: Leverages the official **Google GenAI SDK (`@google/genai`)** with the fast, structured JSON capabilities of **Gemini-3.5-Flash** to enforce pristine data schema consistency.
- **State Management**: Fluid, immediate UI transitions and animations powered by **motion** (`motion/react`).
- **Icons**: Sourced from the robust **lucide-react** library.

---

## ⚙️ Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Installation

1. **Clone the repository** (or download the source directory).
2. **Install all project dependencies**:
   ```bash
   npm install
   ```

### Configuration

The backend server proxy requires a Gemini API key.

1. **Create an environment file** by copying the template:
   ```bash
   cp .env.example .env
   ```
2. **Add your API Key**:
   Open `.env` and define your Google AI Studio API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### Running the Application

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
2. **Open the App**:
   Navigate to `http://localhost:3000` in your web browser to interact with **The Tiebreaker**.

### Building for Production

To compile the application into static client assets and bundle the Express server into a standalone executable:

```bash
# Build the client app and bundle the server
npm run build

# Start the production-ready full-stack application
npm run start
```

The production bundle compiles the server using `esbuild` directly into `dist/server.cjs` and outputs static client assets to `dist/`, optimized for fast cold-starts and maximum performance on container runtimes (like Cloud Run).

---

## 🎨 Design System

**The Tiebreaker** adheres to a custom Swiss-style high-contrast visual design:
- **Palette**: Slate-dark background (`#09090b`), outlined by sharp borders (`#27272a`), highlighting interactive items with deep Indigo indicators (`#6366f1`) and warning states with Rose accents.
- **Typography**: Paired display typography (**Space Grotesk**) for modern technical headers and monospaced layout elements (**JetBrains Mono**) to highlight system status, metrics, and timestamps.
- **Responsiveness**: Fully responsive layout adapting smoothly from handheld touch targets to complex desktop bento-grid layouts.

