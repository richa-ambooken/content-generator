# Autonomous Content Factory

## Project Title
**Autonomous Content Factory** — An AI-Powered Multi-Agent Marketing Content Pipeline

---

## The Problem

Marketing teams face "Creative Burnout" from manually repurposing the same source material across multiple platforms — turning a single article into a LinkedIn post, a Twitter/X thread, and a client newsletter requires repetitive effort that leads to inconsistency and human error. There is no streamlined system to transform one source document into a coordinated, brand-consistent multi-channel campaign instantly.

---

## The Solution

The Autonomous Content Factory is a full-stack web application that orchestrates a pipeline of specialized AI agents to transform a single source document into a complete, quality-checked marketing campaign — automatically.

**Key Features:**

- **Lead Research & Fact-Check Agent** — Reads raw source material (text or URL), extracts core product features, technical specs, and target audience, then produces a structured "Source of Truth" (JSON/Markdown) that all downstream agents follow. Flags ambiguous statements.

- **Creative Copywriter Agent** — Consumes the Fact-Sheet and simultaneously generates a 500-word Blog Post, a 5-post Social Media Thread, and a 1-paragraph Email Teaser — each with the appropriate tone (professional for blog, punchy for social).

- **Editor-in-Chief Agent** — Acts as a quality gatekeeper: checks for hallucinations against the Fact-Sheet, audits tone, and sends specific Correction Notes back to the Copywriter if a draft is rejected, triggering a regeneration loop.

- **Campaign Assembly Dashboard** — A real-time visual interface showing the live agent collaboration feed, side-by-side comparison of source vs. final outputs, and one-click export of the full Campaign Kit.

- **Authentication** — Login and Sign-Up pages for secure, personalized access.

- **Chatbot Interface** — An integrated chat assistant allowing users to request corrections or refinements to generated content after the pipeline completes.

- **Project History Tracker** — Persists previous campaigns so users can revisit, compare, and re-export past content kits.

---

## Tech Stack

| Category | Technology |
|---|---|
| **Frontend Language** | TypeScript |
| **Frontend Framework** | React (with Vite) |
| **UI Components** | shadcn/ui |
| **Styling** | Tailwind CSS |
| **Package Manager** | pnpm |
| **Post CSS** | PostCSS |
| **AI / LLM API** | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| **Agent Orchestration** | Custom multi-agent pipeline (Claude API chained calls) |
| **Export** | Client-side ZIP generation (JSZip) / Clipboard API |

---

## Setup Instructions

### Prerequisites

- **Node.js** v18 or higher
- **pnpm** v8 or higher (`npm install -g pnpm`)
- An **Anthropic API Key** (get one at [console.anthropic.com](https://console.anthropic.com))

### 1. Clone the Repository

```bash
git clone https://github.com/richa-ambooken/<repo-name>.git
cd <repo-name>
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then open `.env` and add your Anthropic API key:

```env
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 4. Run the Project Locally

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`.

### 5. Build for Production (Optional)

```bash
pnpm build
pnpm preview
```

---

## Usage

1. **Sign up / Log in** to your account.
2. On the **Campaign Start Page**, upload a technical document or paste a URL.
3. Watch the **Agent Room** as the Research, Copywriter, and Editor agents collaborate in real time.
4. Review the **Final Outputs** — Blog Post, Social Thread, and Email Teaser — in the Final Review View.
5. Use **Approve / Regenerate** buttons to accept or refine individual pieces.
6. Use the **Chatbot** to request further corrections in natural language.
7. **Export** the complete Campaign Kit as a ZIP file or copy to clipboard.
8. Access previous campaigns anytime via the **History Tracker**.
  
