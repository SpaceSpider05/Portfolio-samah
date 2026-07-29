# Samah AI

Premium digital marketing assistant embedded in the marketing site.

## Architecture

```
Frontend (SamahAiWidget)
  → POST /api/v1/ai/chat  (SSE stream or JSON)
  → AiAssistantService
  → AiProvider (Groq by default)
  → Knowledge base markdown in /knowledge
```

Swap providers later by implementing `App\Ai\Contracts\AiProvider` and updating `App\Providers\AiServiceProvider`.

## Installation

1. Add keys to the Laravel `.env`:

```env
AI_ENABLED=true
AI_PROVIDER=groq
AI_MODEL=llama-3.3-70b-versatile
GROQ_API_KEY=your_groq_api_key
```

2. Run migrations:

```bash
php artisan migrate
```

3. Keep `FRONTEND_URL` pointed at the Next.js app so CORS allows chat requests.

4. Restart Laravel (`php artisan serve` / queue workers as usual) and the Next.js frontend.

## API

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/v1/ai/suggestions?locale=en` | Starter prompts (en/fr/ar) |
| POST | `/api/v1/ai/chat` | Body: `message`, optional `sessionId`, `locale`, `stream` |

Streaming uses Server-Sent Events (`event: meta|token|done`).

When the model qualifies a lead it emits `[[LEAD:{...}]]`. The backend strips that marker from the visible reply and creates a booking via `CreateBooking`.

## Knowledge base

Edit markdown files in `/knowledge` (`services.md`, `pricing.md`, `faq.md`, etc.). The assistant retrieves relevant docs per message and must not invent pricing or guarantees.

## Frontend

Floating button + chat modal mount from `frontend/components/ai/` via `AppProviders`. Conversation history persists in `localStorage` (`samah-ai-chat`). Settings inside the modal cover locale + clear history.

## Admin conversations

Admins can open **AI Conversations** to:

- read full visitor ↔ AI transcripts
- view the saved visitor profile
- generate a CRM summary
- draft / send a human follow-up email

Memory notes (`ai_memory_notes`) store anonymized reusable insights from chats and are injected into future system prompts (pattern memory — not model fine-tuning).
