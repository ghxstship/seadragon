
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  FileText,
  CheckSquare,
  Eye,
  Settings,
  Star,
  StarOff,
  MoreHorizontal,
  Copy,
  Edit,
  Trash2
} from 'lucide-react'

// Template types
export type TemplateType = 'task' | 'view' | 'doc' | 'automation' | 'email'

// Template content interfaces
interface TaskTemplateContent {
  type: 'task'
  title: string
  description: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assignees: string[]
  dueDate?: Date
  checklist?: Array<{ id: string; text: string; completed: boolean }>
  attachments?: Array<{ name: string; url: string }>
}

interface ViewTemplateContent {
  type: 'view'
  viewType: 'kanban' | 'calendar' | 'timeline' | 'gantt' | 'report'
  columns?: string[]
  filters?: Record<string, any>
  sorting?: { field: string; direction: 'asc' | 'desc' }
}

interface DocTemplateContent {
  type: 'doc'
  content: string
  sections?: Array<{ title: string; content: string }>
  attachments?: Array<{ name: string; url: string }>
}

interface AutomationTemplateContent {
  type: 'automation'
  triggers: Array<{ type: string; config: Record<string, any> }>
  actions: Array<{ type: string; config: Record<string, any> }>
  conditions?: Array<{ field: string; operator: string; value: any }>
}

interface EmailTemplateContent {
  type: 'email'
  subject: string
  body: string
  recipients: string[]
  variables?: Record<string, string>
  attachments?: Array<{ name: string; url: string }>
}

type TemplateContent = TaskTemplateContent | ViewTemplateContent | DocTemplateContent | AutomationTemplateContent | EmailTemplateContent

export interface Template {
  id: string
  name: string
  description: string
  type: TemplateType
  category: string
  isPublic: boolean
  isFavorite: boolean
  createdBy: {
    id: string
    name: string
  }
  createdAt: Date
  usageCount: number
  tags: string[]
  content: TemplateContent
}

// Template categories
const templateCategories = {
  task: ['Project Management', 'Bug Reports', 'Feature Requests', 'Meetings', 'Reviews'],
  view: ['Kanban Boards', 'Calendars', 'Timelines', 'Gantt Charts', 'Reports'],
  doc: ['Meeting Notes', 'Project Plans', 'Requirements', 'Guidelines', 'Documentation'],
  automation: ['Workflows', 'Notifications', 'Approvals', 'Integrations'],
  email: ['Notifications', 'Invitations', 'Updates', 'Reminders', 'Announcements']
}

interface TemplatesProps {
  templates: Template[]
  onCreateTemplate?: (template: Omit<Template, 'id' | 'createdAt' | 'usageCount' | 'isFavorite' | 'createdBy'>) => void
  onUpdateTemplate?: (templateId: string, updates: Partial<Template>) => void
  onDeleteTemplate?: (templateId: string) => void
  onUseTemplate?: (template: Template) => void
  onFavoriteTemplate?: (templateId: string, favorite: boolean) => void
  isGuest?: boolean
}

export function Templates({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onUseTemplate,
  onFavoriteTemplate,
  isGuest = false
}: TemplatesProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<TemplateType | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'task' as TemplateType,
    category: '',
    isPublic: false,
    tags: [] as string[]
  })

  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = !searchQuery ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesType = selectedType === 'all' || template.type === selectedType
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory

      return matchesSearch && matchesType && matchesCategory
    })
  }, [templates, searchQuery, selectedType, selectedCategory])

  const templateTypeIcons = {
    task: CheckSquare,
    view: Eye,
    doc: FileText,
    automation: Settings,
    email: FileText
  }

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.category) return

    if (editingTemplate) {
      onUpdateTemplate?.(editingTemplate.id, {
        name: newTemplate.name,
        description: newTemplate.description,
        category: newTemplate.category,
        isPublic: newTemplate.isPublic,
        tags: newTemplate.tags
      })
      setEditingTemplate(null)
    } else {
      onCreateTemplate?.({
        ...newTemplate,
        content: getDefaultTemplateContent(newTemplate.type)
      })
    }

    setNewTemplate({
      name: '',
      description: '',
      type: 'task',
      category: '',
      isPublic: false,
      tags: []
    })
    setIsCreateDialogOpen(false)
  }

  const getDefaultTemplateContent = (type: TemplateType) => {
    switch (type) {
      case 'task':
        return {
          type: 'task',
          title: '',
          description: '',
          priority: 'normal',
          assignees: []
        }
      case 'view':
        return {
          type: 'view',
          viewType: 'kanban',
          columns: ['title', 'status', 'assignees', 'dueDate'],
          filters: {},
          sorting: { field: 'createdAt', direction: 'desc' }
        }
      case 'doc':
        return {
          type: 'doc',
          content: '# New Document\n\nStart writing your content here...',
          sections: []
        }
      case 'automation':
        return {
          type: 'automation',
          triggers: [],
          actions: [],
          conditions: []
        }
      case 'email':
        return {
          type: 'email',
          subject: '',
          body: '',
          recipients: [],
          attachments: [],
          variables: {}
        }
      default:
        return {
          type: 'task',
          title: '',
          description: '',
          priority: 'normal',
          assignees: []
        }
    }
  }

  const getTemplatePreview = (template: Template): string => {
    switch (template.type) {
      case 'task':
      case 'view':
        return `${template.content?.type || 'list'} view • ${Object.keys(template.content?.filters || {}).length} filters`
      case 'doc':
        return template.content?.content?.slice(0, 50) + '...' || 'Empty document'
      case 'automation':
        return `${template.content?.trigger || 'trigger'} → ${template.content?.actions?.length || 0} actions`
      case 'email':
        return template.content?.subject || 'Email template'
      default:
        return 'Template content'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Templates</h2>
          {!isGuest && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-1"/>
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
                  <DialogDescription>
                    Create a reusable template for quick setup.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Template Name</label>
                    <Input
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Bug Report Template"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select
                      disabled={!!editingTemplate}
                      value={newTemplate.type}
                      onValueChange={(value: TemplateType) => setNewTemplate(prev => ({ ...prev, type: value, category: '' }))}
                    >
                      <SelectTrigger>
                        <SelectValue/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="doc">Document</SelectItem>
                        <SelectItem value="automation">Automation</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={newTemplate.category}
                      onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category"/>
                      </SelectTrigger>
                      <SelectContent>
                        {templateCategories[newTemplate.type].map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description..."/>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateTemplate} disabled={!newTemplate.name.trim() || !newTemplate.category}>
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400"/>
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"/>
          </div>

          <Select value={selectedType} onValueChange={(value: TemplateType | 'all') => setSelectedType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Types"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
              <SelectItem value="view">Views</SelectItem>
              <SelectItem value="doc">Documents</SelectItem>
              <SelectItem value="automation">Automations</SelectItem>
              <SelectItem value="email">Emails</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {selectedType !== 'all' && templateCategories[selectedType].map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-neutral-600">
          {filteredTemplates.length} of {templates.length} templates
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-200 flex items-center justify-center">
              <FileText className="w-8 h-8 text-neutral-400"/>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No templates found</h3>
            <p className="text-neutral-600 mb-4 max-w-md">
              {searchQuery || selectedType !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Create your first template to get started.'
              }
            </p>
            {!isGuest && (
              <div>
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false)
                  setEditingTemplate(null)
                  setNewTemplate({
                    name: '',
                    description: '',
                    type: 'task',
                    category: '',
                    isPublic: false,
                    tags: []
                  })
                }}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-1"/>
                  Create Template
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const Icon = templateTypeIcons[template.type]
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-neutral-100">
                          <Icon className="w-5 h-5 text-neutral-600"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{template.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {template.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onFavoriteTemplate?.(template.id, !template.isFavorite)}
                          className="h-8 w-8 p-0"
                        >
                          {template.isFavorite ? (
                            <Star className="w-4 h-4 text-semantic-warning fill-current"/>
                          ) : (
                            <StarOff className="w-4 h-4 text-neutral-400"/>
                          )}
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4"/>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onUseTemplate?.(template)}>
                              <Copy className="w-4 h-4 mr-2"/>
                              Use Template
                            </DropdownMenuItem>
                            {!isGuest && (
                              <>
                                <DropdownMenuItem onClick={() => {

                              setEditingTemplate(template)

                              setNewTemplate({

                                name: template.name,

                                description: template.description,

                                type: template.type,

                                category: template.category,

                                isPublic: template.isPublic,

                                tags: template.tags

                              })

                              setIsCreateDialogOpen(true)

                            }}>
                                  <Edit className="w-4 h-4 mr-2"/>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                  onClick={() => onDeleteTemplate?.(template.id)}
                                  className="text-semantic-error"
                                >
                                  <Trash2 className="w-4 h-4 mr-2"/>
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="text-xs text-neutral-500 mb-3">
                      {getTemplatePreview(template)}
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>Used {template.usageCount} times</span>
                      <span>By {template.createdBy.name}</span>
                    </div>

                    {template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <Button
                      className="w-full mt-4"
                      onClick={() => onUseTemplate?.(template)}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
