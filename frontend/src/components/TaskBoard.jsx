import { useEffect, useState } from 'react'
import api from '../utils/api'

export default function TaskBoard({ workspaceId }) {
  const [ws, setWs] = useState(null)
  const [title, setTitle] = useState('')

  const load = async () => {
    const r = await api.get(`/workspaces/${workspaceId}`)
    setWs(r.data)
  }

  useEffect(() => { load() }, [workspaceId])

  const add = async () => {
    if (!title) return
    await api.post(`/workspaces/${workspaceId}/tasks`, { title })
    setTitle('')
    load()
  }

  const move = async (t, status) => {
    await api.put(`/workspaces/${workspaceId}/tasks/${t._id}`, { status })
    load()
  }

  if (!ws) return null

  const cols = [
    { key: 'todo', name: 'To Do', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
    { key: 'in_progress', name: 'In Progress', color: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
    { key: 'done', name: 'Done', color: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' }
  ]

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input className="flex-1 rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="New task title" value={title} onChange={e=>setTitle(e.target.value)} />
        <button className="rounded-xl px-4 py-3 bg-indigo-600 text-white hover:bg-indigo-700" onClick={add}>Add Task</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cols.map(c => (
          <div key={c.key} className="rounded-xl border bg-white p-3 min-h-[220px]">
            <div className="flex items-center justify-between mb-3">
              <div className={`inline-flex items-center gap-2 text-sm font-medium px-2 py-1 rounded ${c.color}`}>
                <span className={`w-2 h-2 rounded-full ${c.dot}`}></span>
                {c.name}
              </div>
              <div className="text-xs text-gray-500">{ws.tasks.filter(t=>t.status===c.key).length} tasks</div>
            </div>
            <div className="space-y-2">
              {ws.tasks.filter(t => t.status === c.key).map(t => (
                <div key={t._id} className="rounded-lg border bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{t.title}</div>
                    <div className="flex gap-1">
                      {c.key !== 'todo' && <button className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded" onClick={()=>move(t,'todo')}>To Do</button>}
                      {c.key !== 'in_progress' && <button className="text-xs px-2 py-1 bg-amber-100 hover:bg-amber-200 rounded" onClick={()=>move(t,'in_progress')}>In Progress</button>}
                      {c.key !== 'done' && <button className="text-xs px-2 py-1 bg-emerald-100 hover:bg-emerald-200 rounded" onClick={()=>move(t,'done')}>Done</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
