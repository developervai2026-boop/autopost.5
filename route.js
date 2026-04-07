import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { model, messages } = await req.json()

    let reply = ''

    if (model === 'chatgpt') {
      reply = await callOpenAI(messages)
    } else if (model === 'claude') {
      reply = await callClaude(messages)
    } else if (model === 'gemini') {
      reply = await callGemini(messages)
    } else if (model === 'grok') {
      reply = await callGrok(messages)
    } else if (model === 'deepseek') {
      reply = await callDeepSeek(messages)
    } else {
      return NextResponse.json({ error: 'Unknown model' }, { status: 400 })
    }

    return NextResponse.json({ reply })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── ChatGPT (OpenAI) ───────────────────────────────────────────────────────
async function callOpenAI(messages) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.choices[0].message.content
}

// ─── Claude (Anthropic) ─────────────────────────────────────────────────────
async function callClaude(messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.content[0].text
}

// ─── Gemini (Google) ────────────────────────────────────────────────────────
async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      }),
    }
  )
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.candidates[0].content.parts[0].text
}

// ─── Grok (xAI) ─────────────────────────────────────────────────────────────
async function callGrok(messages) {
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.choices[0].message.content
}

// ─── DeepSeek ────────────────────────────────────────────────────────────────
async function callDeepSeek(messages) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.choices[0].message.content
}
