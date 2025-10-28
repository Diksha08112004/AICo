import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'
import ChatBox from '../components/ChatBox'
import TaskBoard from '../components/TaskBoard'
import AnalyticsPanel from '../components/AnalyticsPanel'

export default function Workspace() {
  const { id } = useParams()
  const [workspace, setWorkspace] = useState(null)

  useEffect(() => {
    api.get(`/workspaces/${id}`).then(r => setWorkspace(r.data)).catch(() => {})
  }, [id])

  if (!workspace) return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{workspace.name}</h1>
        <p className="text-gray-500">Collaborate, plan, and chat with AI assistance</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Tasks</h2>
            <div className="bg-white border rounded-xl p-4">
              <TaskBoard workspaceId={id} />
            </div>
          </section>
          <section>
            <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Chat</h2>
            <div className="bg-white border rounded-xl p-4">
              <ChatBox workspaceId={id} />
            </div>
          </section>
        </div>
        <div className="space-y-6">
          <section>
            <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Analytics</h2>
            <AnalyticsPanel workspaceId={id} />
          </section>
        </div>
      </div>
    </div>
  )
}
