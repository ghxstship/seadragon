
'use client'

import { logger } from '@/lib/logger'
import { CommandBar } from '@/components/command-bar'
import { ViewsBar } from '@/components/views-bar'
import ListLayout from '@/components/layouts/list-layout'
import { KanbanBoard } from '@/components/workflow/kanban-board'
import { CalendarView } from '@/components/views/calendar-view' // Keep calendar view as it's specialized
import { TaskActions } from '@/components/task-actions'
import { TaskDetailView } from '@/components/task-detail-view'
import { Button } from "@/components/ui/button"

// Task status and priority types
type TaskPriority = 'low' | 'normal' | 'high' | 'urgent'

interface TaskApiResponse {
  id: string | number
  title?: string
  description?: string
  status?: string
  priority?: string
  assigned_to?: string
  due_date?: string
  start_date?: string
  created_at?: string
  updated_at?: string
  created_by?: string
  tags?: string[]
}

interface TaskData {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignees: { id: string; name: string; avatar: string }[]
  dueDate: Date
  startDate?: Date
  createdAt: Date
  updatedAt: Date
  creator: { id: string; name: string }
  tags: string[]
  subtasks?: { id: string; title: string; completed: boolean }[]
}

const availableViews = [
  { id: 'list', name: 'All Tasks', type: 'list' as const, isPinned: true },
  { id: 'board', name: 'Kanban Board', type: 'board' as const },
  { id: 'calendar', name: 'Calendar View', type: 'calendar' as const }
]

export default function PublicDashboardPage() {
  const [currentView, setCurrentView] = useState('list')
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch tasks from API on mount
  useEffect(() => {
    let cancelled = false

    const loadTasks = async () => {
      try {
        const res = await fetch('/api/v1/tasks?limit=50')
        if (res.ok) {
          const data = await res.json()
          const rawTasks = Array.isArray(data.tasks) ? data.tasks : []
          // Map DB tasks to TaskData shape
          const mapped: TaskData[] = rawTasks.map((t: TaskApiResponse) => ({
            id: String(t.id),
            title: String(t.title || 'Untitled'),
            description: String(t.description || ''),
            priority: (['low', 'normal', 'high', 'urgent'].includes(t.priority) ? t.priority : 'normal') as TaskPriority,
            assignees: t.assigned_to ? [{ id: '1', name: String(t.assigned_to), avatar: '' }] : [],
            dueDate: t.due_date ? new Date(t.due_date) : new Date(),
            startDate: t.start_date ? new Date(t.start_date) : undefined,
            createdAt: new Date(t.created_at || Date.now()),
            updatedAt: new Date(t.updated_at || Date.now()),
            creator: { id: '1', name: t.created_by || 'System' },
            tags: Array.isArray(t.tags) ? t.tags : []
          }))
          if (!cancelled) {
            setTasks(mapped)
            setIsLoading(false)
          }
        } else {
          if (!cancelled) {
            setTasks([])
            setIsLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading tasks:', error)
        if (!cancelled) {
          setTasks([])
          setIsLoading(false)
        }
      }
    }

    loadTasks()

    return () => {
      cancelled = true
    }
  }, [])

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find((t: TaskData) => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setShowTaskDetail(true)
    }
  }

  const handleTaskUpdate = (taskId: string, updates: Record<string, unknown>) => {
    // In a real app, this would update the task via API
    logger.action('update_task', { taskId, updates })
  }

  const handleCreateTask = () => {
    // In a real app, this would open a create task modal
    logger.action('create_task')
  }

  const renderCurrentView = () => {
    const viewProps = {
      tasks: tasks,
      onTaskClick: handleTaskClick,
      onTaskUpdate: handleTaskUpdate,
      onCreateTask: handleCreateTask,
      isGuest: true
    }

    switch (currentView) {
      case 'board':
        return (
          <KanbanBoard
            columns={[
              {
                title: 'To Do',
                cards: tasks
                  .map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    priority: (() => {
                      switch (task.priority) {
                        case 'urgent': return 'urgent'
                        case 'high': return 'high'
                        case 'normal': return 'medium'
                        default: return 'low'
                      }
                    })(),
                    assignee: task.assignees[0] ? {
                      id: task.assignees[0].id,
                      name: task.assignees[0].name,
                      avatar: task.assignees[0].avatar
                    } : undefined,
                    labels: task.tags.map((tag: string) => ({ id: tag, name: tag, color: 'blue' })),
                    dueDate: task.dueDate
                  }))
              },
              {
                id: 'in_progress',
                title: 'In Progress',
                wipLimit: 5,
                cards: tasks
                  .filter(task => task.status === 'in_progress')
                  .map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    priority: (() => {
                      switch (task.priority) {
                        case 'urgent': return 'urgent'
                        case 'high': return 'high'
                        case 'normal': return 'medium'
                        default: return 'low'
                      }
                    })(),
                    assignee: task.assignees[0] ? {
                      id: task.assignees[0].id,
                      name: task.assignees[0].name,
                      avatar: task.assignees[0].avatar
                    } : undefined,
                    labels: task.tags.map((tag: string) => ({ id: tag, name: tag, color: 'blue' })),
                    dueDate: task.dueDate
                  }))
              },
              {
                id: 'review',
                title: 'Review',
                wipLimit: 3,
                cards: tasks
                  .filter(task => task.status === 'review')
                  .map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    priority: (() => {
                      switch (task.priority) {
                        case 'urgent': return 'urgent'
                        case 'high': return 'high'
                        case 'normal': return 'medium'
                        default: return 'low'
                      }
                    })(),
                    assignee: task.assignees[0] ? {
                      id: task.assignees[0].id,
                      name: task.assignees[0].name,
                      avatar: task.assignees[0].avatar
                    } : undefined,
                    labels: task.tags.map((tag: string) => ({ id: tag, name: tag, color: 'blue' })),
                    dueDate: task.dueDate
                  }))
              },
              {
                id: 'done',
                title: 'Done',
                cards: tasks
                  .filter(task => task.status === 'done')
                  .map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    priority: (() => {
                      switch (task.priority) {
                        case 'urgent': return 'urgent'
                        case 'high': return 'high'
                        case 'normal': return 'medium'
                        default: return 'low'
                      }
                    })(),
                    assignee: task.assignees[0] ? {
                      id: task.assignees[0].id,
                      name: task.assignees[0].name,
                      avatar: task.assignees[0].avatar
                    } : undefined,
                    labels: task.tags.map((tag: string) => ({ id: tag, name: tag, color: 'blue' })),
                    dueDate: task.dueDate
                  }))
              }
            ]}
            onCardMove={(cardId, fromColumnId, toColumnId) => {
              const statusMap: Record<string, string> = {
                'in_progress': 'in_progress',
                'review': 'review',
                'done': 'done'
              }
            }}/>
        )
      case 'calendar':
        return <CalendarView {...viewProps}/>
      case 'list':
      default:
        return (
          <ListLayout
            title="All Tasks"
            totalItems={tasks.length}
            currentPage={1}
            pageSize={20}
            onPageChange={(page) => logger.action('page_change', { page })}
            searchValue=""
            onSearchChange={(value) => logger.search(value)}
            filters={[]}
            onFilterChange={(filterId, value) => logger.action('filter_change', { filterId, value })}
            sortOptions={[
              { id: 'title', label: 'Title', direction: 'asc' },
              { id: 'dueDate', label: 'Due Date', direction: 'asc' },
              { id: 'priority', label: 'Priority', direction: 'desc' }
            ]}
            onSortChange={(sort: { id: string; label: string; direction: 'asc' | 'desc' }) => logger.action('sort_change', { sort })}
            bulkActions={[
              { id: 'complete', label: 'Mark Complete', onClick: (ids) => logger.action('bulk_complete', { ids }) },
              { id: 'delete', label: 'Delete', onClick: (ids) => logger.action('bulk_delete', { ids }) }
            ]}
            selectable={true}
          >
            <div className="space-y-4">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleTaskClick(task.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-neutral-600">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'in_progress' ? 'bg-accent-primary/10 text-blue-800' :
                        task.status === 'review' ? 'bg-semantic-warning/10 text-yellow-800' :
                        task.status === 'done' ? 'bg-semantic-success/10 text-green-800' :
                        'bg-neutral-100 text-neutral-800'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-neutral-500 mt-1">
                        Due: {task.dueDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ListLayout>
        )
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50" role="application" aria-label="Dashboard">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent-primary text-primary-foreground px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      {/* Command Bar - Fixed at top */}
      <header className="sticky top-0 z-50" role="banner">
        <CommandBar
          isGuest={true}
          onSearch={(query) => logger.search(query)}
          onCreate={(type) => logger.action('create', { type })}/>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Sidebar Toggle */}
        <Button
          className="lg:hidden fixed top-20 left-4 z-40 bg-background border border-neutral-200 rounded p-2 shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </Button>

        {/* Sidebar - Collapsible on mobile */}
        <aside
          className={`w-full lg:w-64 bg-background border-r border-neutral-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } lg:min-h-screen fixed lg:static inset-y-0 left-0 z-30 lg:z-auto`}
          role="complementary"
          aria-label="Workspace navigation"
        >
          <div className="p-4 pt-16 lg:pt-4">
            <h2 className="text-lg font-semibold mb-4" id="sidebar-heading">Workspace</h2>
            <nav aria-labelledby="sidebar-heading" className="space-y-2">
              <a
                href="#"
                className="block px-3 py-2 rounded hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                aria-current="page"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                Tasks
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                Calendar
              </a>
            </nav>
          </div>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-neutral-900 bg-opacity-50 z-20"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"/>
          )}
        </aside>

        {/* Main Content */}
        <main
          id="main-content"
          className="flex-1 min-h-screen lg:ml-0"
          role="main"
          aria-label="Dashboard content"
        >
          {/* Views Bar */}
          <section aria-label="View controls">
            <ViewsBar
              currentView={currentView}
              availableViews={availableViews}
              onViewChange={setCurrentView}
              onCreateView={(type) => logger.action('create_view', { type })}
              onPinView={(viewId, pinned) => logger.action('pin_view', { viewId, pinned })}
              onUpdateView={(viewId, updates) => logger.action('update_view', { viewId, updates })}
              isGuest={true}/>
          </section>

          {/* Current View Content */}
          <section
            className="p-4 lg:p-6"
            aria-label={`Task view: ${currentView}`}
          >
            {renderCurrentView()}
          </section>
        </main>
      </div>

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-detail-title"
          className="fixed inset-0 z-50 bg-neutral-900 bg-opacity-50 flex items-center justify-center p-4"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowTaskDetail(false)
          }}
        >
          <div className="bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <TaskDetailView
              task={selectedTask}
              breadcrumbs={[
                { label: 'Dashboard', href: '/public/dashboard' },
                { label: selectedTask.title }
              ]}
              onUpdate={(updates) => {
                logger.action('update_task', { updates })
                setShowTaskDetail(false)
              }}
              onClose={() => setShowTaskDetail(false)}
              onDelete={() => {
                logger.action('delete_task', { taskId: selectedTask.id })
                setShowTaskDetail(false)
              }}
              isGuest={true}/>
          </div>
        </div>
      )}

      {/* Floating Task Actions */}
      <div className="fixed bottom-6 right-6 z-40" role="complementary" aria-label="Quick actions">
        <TaskActions
          task={{
            id: '',
            title: '',
            priority: 'normal',
            assignees: [],
            tags: []
          }}
          availableUsers={[]}
          availableTags={[]}
          onCreate={handleCreateTask}
          onEdit={() => {}}
          onDuplicate={() => {}}
          onShare={() => {}}
          onAssign={() => {}}
          onSetPriority={() => {}}
          onSetDates={() => {}}
          onSetRecurring={() => {}}
          onAddDependency={() => {}}
          onTimeTracking={() => {}}
          onAddSubtask={() => {}}
          onAddTag={() => {}}
          onAddAttachment={() => {}}
          onAddComment={() => {}}
          onScheduleEmail={() => {}}
          isGuest={true}/>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedTask && showTaskDetail ? `Task details opened for ${selectedTask.title}` : ''}
      </div>
    </div>
  )
}
