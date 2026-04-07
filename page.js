'use client'
import { useState, useRef, useEffect } from 'react'
import styles from './page.module.css'

const MODELS = [
  { id: 'chatgpt',  label: 'ChatGPT',   color: '#10a37f', icon: '🟢' },
  { id: 'claude',   label: 'Claude',    color: '#d97757', icon: '🟠' },
  { id: 'gemini',   label: 'Gemini',    color: '#4285f4', icon: '🔵' },
  { id: 'grok',     label: 'Grok',      color: '#ffffff', icon: '⚪' },
  { id: 'deepseek', label: 'DeepSeek',  color: '#5b6af0', icon: '🟣' },
]

export default function Home() {
  const [selected, setSelected] = useState('chatgpt')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const model = MODELS.find(m => m.id === selected)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selected, messages: [...messages, userMsg] }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, model: selected }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error: ' + e.message, model: selected }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className={styles.app}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>⚡ AI Chat</div>
        <nav className={styles.nav}>
          {MODELS.map(m => (
            <button
              key={m.id}
              className={`${styles.modelBtn} ${selected === m.id ? styles.active : ''}`}
              style={{ '--accent': m.color }}
              onClick={() => setSelected(m.id)}
            >
              <span className={styles.dot} style={{ background: m.color }} />
              {m.label}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <p>API keys in<br /><code>.env.local</code></p>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <header className={styles.header}>
          <span className={styles.headerDot} style={{ background: model.color }} />
          <span>{model.label}</span>
        </header>

        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>{model.icon}</div>
              <p>Start chatting with <strong>{model.label}</strong></p>
            </div>
          )}
          {messages.map((msg, i) => {
            const msgModel = MODELS.find(m => m.id === msg.model)
            return (
              <div key={i} className={`${styles.msg} ${styles[msg.role]}`}>
                <div className={styles.msgLabel}>
                  {msg.role === 'user' ? 'You' : msgModel?.label || 'AI'}
                </div>
                <div
                  className={styles.bubble}
                  style={msg.role === 'assistant' ? { borderColor: msgModel?.color + '55' } : {}}
                >
                  {msg.content}
                </div>
              </div>
            )
          })}
          {loading && (
            <div className={`${styles.msg} ${styles.assistant}`}>
              <div className={styles.msgLabel}>{model.label}</div>
              <div className={styles.bubble} style={{ borderColor: model.color + '55' }}>
                <span className={styles.typing}>
                  <span /><span /><span />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className={styles.inputRow}>
          <textarea
            className={styles.textarea}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message ${model.label}...`}
            rows={1}
          />
          <button
            className={styles.sendBtn}
            style={{ '--accent': model.color }}
            onClick={send}
            disabled={loading || !input.trim()}
          >
            ↑
          </button>
        </div>
      </main>
    </div>
  )
}
