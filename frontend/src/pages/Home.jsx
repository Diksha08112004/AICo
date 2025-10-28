import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

export default function Home() {
  const [workspaces, setWorkspaces] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    api.get('/workspaces').then(r => setWorkspaces(r.data)).catch(() => {})
  }, [])

  const createWs = async () => {
    if (!name) return
    const r = await api.post('/workspaces', { name })
    setWorkspaces([r.data, ...workspaces])
    setName('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white">
          <h1 className="text-2xl sm:text-3xl font-semibold">Your Collaborative Workspaces</h1>
          <p className="text-white/90 mt-2">Create, organize, and collaborate with AI-enhanced tools.</p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <input className="rounded-lg px-4 py-3 flex-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="New workspace name" value={name} onChange={e=>setName(e.target.value)} />
            <button className="rounded-lg px-5 py-3 bg-white/90 text-indigo-700 font-medium hover:bg-white" onClick={createWs}>Create Workspace</button>
          </div>
        </div>
        <div className="p-6">
          {workspaces.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No workspaces yet. Create your first one above.</div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map(w => (
                <li key={w._id} className="group border rounded-xl p-4 bg-white hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-indigo-700">{w.name}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {w._id?.slice(-6)}</div>
                    </div>
                    <Link className="text-indigo-700 hover:text-indigo-800 text-sm" to={`/workspace/${w._id}`}>Open</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
