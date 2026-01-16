
import { format } from 'date-fns'

interface TaskUpdate {
  title?: string
  description?: string
  priority?: 'urgent' | 'high' | 'normal' | 'low'
  assignees?: Array<{
    id: string
    name: string
    avatar?: string
  }>
  dueDate?: Date
  startDate?: Date
  location?: {
    lat: number
    lng: number
    address?: string
  }
  customFields?: Array<{
    id: string
    label: string
    value: string | number | boolean
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox'
  }>
  tags?: string[]
  subtasks?: Array<{
    id: string
    title: string
    completed: boolean
  }>
}

interface MapViewProps {
  tasks: Array<{
    id: string
    title: string
    description?: string
    priority: 'urgent' | 'high' | 'normal' | 'low'
    assignees: Array<{
      id: string
      name: string
      avatar?: string
    }>
    dueDate?: Date
    startDate?: Date
    location?: {
      lat: number
      lng: number
      address?: string
    }
    customFields?: Array<{
      id: string
      label: string
      value: string | number | boolean
      type: 'text' | 'number' | 'date' | 'select' | 'checkbox'
    }>
    tags?: string[]
    subtasks?: Array<{
      id: string
      title: string
      completed: boolean
    }>
  }>
  onTaskClick?: (taskId: string) => void
  onTaskUpdate?: (taskId: string, updates: TaskUpdate) => void
  onCreateTask?: (location?: { lat: number; lng: number }) => void
  isGuest?: boolean
}

const statusColors = {
  in_progress: 'bg-accent-primary/10 border-blue-300 text-accent-tertiary',
  review: 'bg-semantic-warning/10 border-orange-300 text-orange-700',
  done: 'bg-semantic-success/10 border-green-300 text-semantic-success',
}

export function MapView({
  tasks,
  onTaskClick,
  onTaskUpdate,
  onCreateTask,
  isGuest = false
}: MapViewProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }) // Default to NYC
  const [zoom, setZoom] = useState(10)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Filter tasks with locations
  const mapTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!task.location) return false
      if (filterStatus !== 'all' && task.status !== filterStatus) return false
      return true
    })
  }, [tasks, filterStatus])

  // Calculate bounds for all tasks
  const mapBounds = useMemo(() => {
    if (mapTasks.length === 0) return null

    let minLat = Infinity, maxLat = -Infinity
    let minLng = Infinity, maxLng = -Infinity

    mapTasks.forEach(task => {
      if (task.location) {
        minLat = Math.min(minLat, task.location.lat)
        maxLat = Math.max(maxLat, task.location.lat)
        minLng = Math.min(minLng, task.location.lng)
        maxLng = Math.max(maxLng, task.location.lng)
      }
    })

    return { minLat, maxLat, minLng, maxLng }
  }, [mapTasks])

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(selectedTask === taskId ? null : taskId)
    onTaskClick?.(taskId)
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (!isGuest) {
      onCreateTask?.({ lat, lng })
    }
  }

  const fitBounds = () => {
    if (mapBounds) {
      const centerLat = (mapBounds.minLat + mapBounds.maxLat) / 2
      const centerLng = (mapBounds.minLng + mapBounds.maxLng) / 2
      setMapCenter({ lat: centerLat, lng: centerLng })
      // Adjust zoom based on bounds
      setZoom(8)
    }
  }

  // Mock map rendering - in real app, use Google Maps, MapBox, etc.
  const renderMap = () => (
    <div className="relative w-full h-full bg-neutral-100 rounded-lg overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200">
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({ length: 96 }).map((_, i) => (
              <div key={i} className="border border-white border-opacity-30"/>
            ))}
          </div>
        </div>
      </div>

      {/* Task markers */}
      {mapTasks.map((task) => (
        <div
          key={task.id}
          className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all hover:scale-110 ${
            selectedTask === task.id ? 'z-20' : 'z-10'
          }`}
          style={{
            left: `${((task.location!.lng - (mapCenter.lng - 10)) / 20) * 100}%`,
            top: `${((mapCenter.lat - task.location!.lat) / 20) * 100}%`,
          }}
          onClick={() => handleTaskClick(task.id)}
        >
          {/* Marker pin */}
          <div className="relative">
            <MapPin className={`w-8 h-8 ${statusColors[task.status]} rounded-full border-2 border-white shadow-lg`}/>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-background rounded-full flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${
                task.priority === 'urgent' ? 'bg-semantic-error' :
                task.priority === 'high' ? 'bg-semantic-warning' :
                task.priority === 'normal' ? 'bg-accent-primary' : 'bg-neutral-500'
              }`}/>
            </div>
          </div>

          {/* Task info popup */}
          {selectedTask === task.id && (
            <Card className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 shadow-lg z-30">
              <CardContent className="p-3">
                <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={`text-xs ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-neutral-500">{task.priority}</span>
                </div>
                {task.location?.address && (
                  <p className="text-xs text-neutral-600 mb-2">{task.location.address}</p>
                )}
                {task.dueDate && (
                  <p className="text-xs text-neutral-600">
                    Due: {format(task.dueDate, 'MMM d, yyyy')}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ))}

      {/* Click to add task */}
      <div
        className="absolute inset-0 cursor-crosshair"
        onClick={(e) => {
          if (isGuest) return
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const lng = mapCenter.lng - 10 + (x / rect.width) * 20
          const lat = mapCenter.lat + 10 - (y / rect.height) * 20
          handleMapClick(lat, lng)
        }}
        title={isGuest ? '' : 'Click to add task at this location'}/>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Map View</h2>
          <div className="flex items-center space-x-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter by status"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={fitBounds} disabled={mapTasks.length === 0}>
              <Navigation className="w-4 h-4 mr-1"/>
              Fit Bounds
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateTask?.()}
              disabled={isGuest}
            >
              <Plus className="w-4 h-4 mr-1"/>
              New Task
            </Button>
          </div>
        </div>

        {/* Map Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(1, zoom - 1))}>
              <ZoomOut className="w-4 h-4"/>
            </Button>
            <span className="text-sm text-neutral-600">Zoom: {zoom}</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(20, zoom + 1))}>
              <ZoomIn className="w-4 h-4"/>
            </Button>
          </div>

          <div className="text-sm text-neutral-600">
            {mapTasks.length} tasks with locations
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {renderMap()}

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-background rounded-lg shadow-lg p-3">
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-semantic-error rounded-full"></div>
              <span className="text-xs">Urgent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-semantic-warning rounded-full"></div>
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-primary rounded-full"></div>
              <span className="text-xs">Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-neutral-500 rounded-full"></div>
              <span className="text-xs">Low</span>
            </div>
          </div>
        </div>

        {/* Task List Sidebar */}
        <div className="absolute bottom-4 left-4 bg-background rounded-lg shadow-lg p-3 max-w-xs">
          <h4 className="text-sm font-medium mb-2">Tasks on Map</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {mapTasks.slice(0, 10).map((task) => (
              <div
                key={task.id}
                className={`p-2 rounded cursor-pointer text-sm ${
                  selectedTask === task.id ? 'bg-accent-primary bg-opacity-10' : 'hover:bg-neutral-50'
                }`}
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="font-medium truncate">{task.title}</div>
                <div className="flex items-center space-x-1 mt-1">
                  <Badge className={`text-xs ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  {task.dueDate && (
                    <span className="text-xs text-neutral-500">
                      {format(task.dueDate, 'MMM d')}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {mapTasks.length > 10 && (
              <div className="text-xs text-neutral-500 text-center">
                +{mapTasks.length - 10} more tasks
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
