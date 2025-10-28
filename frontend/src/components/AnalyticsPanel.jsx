import { useEffect, useMemo, useState } from 'react'
import api from '../utils/api'

export default function AnalyticsPanel({ workspaceId }) {
  const [ws, setWs] = useState(null)

  useEffect(() => {
    api.get(`/workspaces/${workspaceId}`).then(r => setWs(r.data)).catch(() => {})
  }, [workspaceId])

  const stats = useMemo(() => {
    if (!ws) return { todo: 0, in_progress: 0, done: 0 }
    return {
      todo: ws.tasks.filter(t=>t.status==='todo').length,
      in_progress: ws.tasks.filter(t=>t.status==='in_progress').length,
      done: ws.tasks.filter(t=>t.status==='done').length
    }
  }, [ws])

  return (
    <div className="border rounded p-3">
      <div className="font-medium mb-2">Analytics</div>
      <div className="space-y-1">
        <div>To Do: {stats.todo}</div>
        <div>In Progress: {stats.in_progress}</div>
        <div>Done: {stats.done}</div>
      </div>
    </div>
  )
}
