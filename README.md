# ⚡ AI Chat — 5 Models

Chat with **ChatGPT, Claude, Gemini, Grok & DeepSeek** in one app.

---

## 🚀 Deploy করার নিয়ম (Step by Step)

### Step 1 — GitHub-এ দাও
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/তোমার-username/তোমার-repo.git
git push -u origin main
```

### Step 2 — Vercel-এ API Keys দাও
Vercel Dashboard → তোমার Project → **Settings → Environment Variables**

| Variable Name         | Value             |
|-----------------------|-------------------|
| `OPENAI_API_KEY`      | sk-...            |
| `ANTHROPIC_API_KEY`   | sk-ant-...        |
| `GEMINI_API_KEY`      | AIza...           |
| `GROK_API_KEY`        | xai-...           |
| `DEEPSEEK_API_KEY`    | sk-...            |

### Step 3 — Redeploy
Environment Variables দেওয়ার পর **Redeploy** করো।

---

## 🔑 API Keys কোথায় পাবে

| AI       | Link |
|----------|------|
| ChatGPT  | https://platform.openai.com/api-keys |
| Claude   | https://console.anthropic.com/ |
| Gemini   | https://aistudio.google.com/app/apikey |
| Grok     | https://console.x.ai/ |
| DeepSeek | https://platform.deepseek.com/api_keys |

---

## 💻 Local-এ চালাতে চাইলে

```bash
# .env.local ফাইল বানাও (উদাহরণ .env.example-এ আছে)
cp .env.example .env.local
# তারপর API keys বসাও

npm install
npm run dev
# http://localhost:3000 খোলো
```
