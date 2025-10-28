import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import api from '../utils/api'

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000')

export default function ChatBox({ workspaceId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    socket.emit('join_workspace', workspaceId)
    const handler = (msg) => {
      if (msg.workspaceId === workspaceId) setMessages(m => [...m, msg])
    }
    socket.on('chat_message', handler)
    return () => socket.off('chat_message', handler)
  }, [workspaceId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input) return
    const msg = { workspaceId, text: input, sender: 'me', ts: Date.now() }
    setMessages(m => [...m, msg])
    socket.emit('chat_message', msg)
    setInput('')
  }

  const askAI = async () => {
    try {
      setError('')
      setLoading(true)
      const payload = { messages: messages.slice(-10).map(m => ({ role: m.sender === 'me' ? 'user' : 'assistant', content: m.text })) }
      const reply = await api.post('/ai/chat', payload)
      const aiMsg = { workspaceId, text: reply.data?.reply || '(no reply)', sender: 'ai', ts: Date.now() }
      setMessages(m => [...m, aiMsg])
    } catch (e) {
      const detail = e?.response?.data?.detail || e?.message || 'Unknown error'
      setError(`Ask AI failed: ${detail}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-96 flex flex-col">
      {error && (
        <div className="mb-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>
      )}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === 'me' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={
              'max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ' +
              (m.sender === 'me' ? 'bg-indigo-600 text-white rounded-br-sm' : m.sender === 'ai' ? 'bg-gray-100 text-gray-900 rounded-bl-sm' : 'bg-white border text-gray-900')
            }>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input className="flex-1 rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message" disabled={loading} />
        <button className="rounded-xl px-4 py-3 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50" onClick={send} disabled={loading}>Send</button>
        <button className="rounded-xl px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50" onClick={askAI} disabled={loading}>{loading ? 'Thinking…' : 'Ask AI'}</button>
      </div>
    </div>
  )
}
