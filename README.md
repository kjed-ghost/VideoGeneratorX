# ContentFlow — AI-Powered Video Content Automation

ContentFlow is a full-stack web application designed to automate the video creation process, from research to publishing. It follows a "Bring Your Own Key" (BYOK) architecture, ensuring zero operational costs for the platform owner while giving users full control over their API usage.

## Features

- **Module 1: Auth & Dashboard** — Secure login via Supabase.
- **Module 2: Research** — Real-time Google Trends and Google News RSS aggregation.
- **Module 3: AI Scripting** — Generate scripts using Gemini, Claude (Anthropic), or Groq.
- **Module 4: Voiceover** — Integration with ElevenLabs and Kokoro (HuggingFace).
- **Module 5: Video Gen** — Support for Luma AI, Pika, and more.
- **Module 6: AI Editor** — automated consistency checks and manual review.
- **Module 7: Publish** — Direct upload to YouTube and Meta Business Suite + Make.com automation.

## Tech Stack

- **Frontend:** React 18, TailwindCSS v4, Framer Motion, Lucide React.
- **Backend:** Vercel Serverless Functions (Node.js).
- **Database/Auth:** Supabase.
- **AI Integration:** Direct SDKs and REST APIs for BYOK.

## Setup Instructions

1. **Clone the repository.**
2. **Install dependencies:** `npm install`
3. **Environment Variables:**
   - Create a `.env` file based on `.env.example`.
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - Set `VITE_ENCRYPTION_KEY` (32 characters) for securing user API keys.
4. **Supabase Schema:**
   - Run the SQL in `supabase_schema.sql` in your Supabase SQL Editor.
5. **Run locally:** `npm run dev`
6. **Deploy:**
   - Frontend: `npm run deploy` (GitHub Pages)
   - Backend: Push to Vercel.

## OAuth Setup

- **Google:** Create an OAuth 2.0 Client ID in Google Cloud Console. Enable YouTube Data API v3.
- **Meta:** Create a Meta App, add Instagram Graph API and Pages API.

## License

MIT
