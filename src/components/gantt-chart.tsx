
interface GanttChartProps {
  tasks?: Array<{ id: string; name: string }>
  title?: string
  children?: React.ReactNode
  groupBy?: string
  showBaseline?: boolean
  showCriticalPath?: boolean
}

export default function GanttChart({ tasks = [], title = 'Gantt Chart', children }: GanttChartProps) {
  return (
    <div>
      <h1>{title}</h1>
      {tasks.map(task => (
        <div key={task.id}>{task.name}</div>
      ))}
      <button>Export</button>
      <button>Refresh</button>
      {children}
    </div>
  )
}
