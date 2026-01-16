
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Database,
  Link,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  Users,
  Lock,
  Unlock,
  Settings,
  Plus,
  ArrowRight,
  Filter
} from 'lucide-react'

// RBAC/RLS Types
type Permission = 'read' | 'write' | 'delete' | 'admin'
type Role = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest'

interface UserRole {
  userId: string
  userName: string
  role: Role
  permissions: Permission[]
}

interface RecordLink {
  id: string
  fromTable: string
  fromRecordId: string
  toTable: string
  toRecordId: string
  relationship: 'one-to-one' | 'one-to-many' | 'many-to-many'
  label: string
}

interface DatabaseView {
  id: string
  name: string
  tableName: string
  description: string
  columns: Array<{
    id: string
    name: string
    type: string
    visible: boolean
    linkedTable?: string
  }>
  linkedViews: RecordLink[]
  rbac: {
    enabled: boolean
    roles: UserRole[]
    rlsPolicies: Array<{
      id: string
      name: string
      condition: string
      roles: Role[]
    }>
  }
  records: Array<Record<string, any>>
}

interface DatabaseViewsProps {
  views: DatabaseView[]
  currentUser: {
    id: string
    role: Role
    permissions: Permission[]
  }
  onViewRecord?: (viewId: string, recordId: string) => void
  onEditRecord?: (viewId: string, recordId: string) => void
  onDeleteRecord?: (viewId: string, recordId: string) => void
  onCreateRecord?: (viewId: string) => void
  onUpdateRBAC?: (viewId: string, rbac: DatabaseView['rbac']) => void
  onAddLink?: (fromViewId: string, link: RecordLink) => void
  isGuest?: boolean
}

export function DatabaseViews({
  views,
  currentUser,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onCreateRecord,
  onUpdateRBAC,
  onAddLink,
  isGuest = false
}: DatabaseViewsProps) {
  const [selectedView, setSelectedView] = useState<string | null>(views[0]?.id || null)
  const [showRBACDialog, setShowRBACDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  const currentView = views.find(v => v.id === selectedView)

  // Apply RBAC/RLS filtering
  const filteredRecords = useMemo(() => {
    if (!currentView) return []

    let records = currentView.records

    // Apply RLS policies if enabled
    if (currentView.rbac.enabled) {
      records = records.filter(record => {
        // Check if user has access via RLS policies
        return currentView.rbac.rlsPolicies.some(policy => {
          if (!policy.roles.includes(currentUser.role)) return false

          // Simple condition evaluation (in real app, this would be more complex)
          try {
            // Basic condition evaluation for demo
            if (policy.condition.includes('owner_id')) {
              return record.owner_id === currentUser.id
            }
            if (policy.condition.includes('department')) {
              return record.department === 'engineering' // User's department
            }
            return true
          } catch {
            return false
          }
        })
      })
    }

    return records
  }, [currentView, currentUser])

  const userPermissions = useMemo(() => {
    if (!currentView?.rbac.enabled) return ['read', 'write', 'delete', 'admin']

    const userRole = currentView.rbac.roles.find(r => r.userId === currentUser.id)
    return userRole?.permissions || ['read']
  }, [currentView, currentUser])

  const canRead = userPermissions.includes('read')
  const canWrite = userPermissions.includes('write')
  const canDelete = userPermissions.includes('delete')
  const canAdmin = userPermissions.includes('admin')

  const renderLinkedRecords = (record: Record<string, any>, links: RecordLink[]) => {
    const linkedRecords = links.filter(link =>
      link.fromTable === currentView?.tableName && link.fromRecordId === record.id
    )

    if (linkedRecords.length === 0) return null

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {linkedRecords.map(link => (
          <Badge key={link.id} variant="outline" className="text-xs flex items-center">
            <Link className="w-3 h-3 mr-1"/>
            {link.label}: {link.toRecordId}
            <ArrowRight className="w-3 h-3 ml-1"/>
          </Badge>
        ))}
      </div>
    )
  }

  if (!currentView) {
    return (
      <div className="text-center py-12">
        <Database className="w-16 h-16 mx-auto mb-4 text-neutral-400"/>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No database views available</h3>
        <p className="text-neutral-600">Create your first database view to get started.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center">
              <Database className="w-5 h-5 mr-2"/>
              Database Views
            </h2>
            <p className="text-sm text-neutral-600">Linked record viewing with RBAC/RLS</p>
          </div>

          {!isGuest && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowLinkDialog(true)}>
                <Link className="w-4 h-4 mr-1"/>
                Add Link
              </Button>
              <Button variant="outline" onClick={() => setShowRBACDialog(true)}>
                <Shield className="w-4 h-4 mr-1"/>
                RBAC Settings
              </Button>
              <Button onClick={() => onCreateRecord?.(currentView.id)}>
                <Plus className="w-4 h-4 mr-1"/>
                Add Record
              </Button>
            </div>
          )}
        </div>

        {/* View Selector */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">View:</span>
          <div className="flex space-x-2">
            {views.map(view => (
              <Button
                key={view.id}
                variant={selectedView === view.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView(view.id)}
              >
                {view.name}
                {view.rbac.enabled && (
                  <Shield className="w-3 h-3 ml-1"/>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* RBAC Status */}
        {currentView.rbac.enabled && (
          <div className="mt-3 flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center">
              <Shield className="w-3 h-3 mr-1"/>
              RBAC Enabled
            </Badge>
            <Badge variant="secondary">
              Your Role: {currentUser.role}
            </Badge>
            <div className="flex space-x-1">
              {userPermissions.map(perm => (
                <Badge key={perm} variant="outline" className="text-xs">
                  {perm}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {canRead ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentView.name}</span>
                <Badge variant="outline">
                  {filteredRecords.length} records
                </Badge>
              </CardTitle>
              <p className="text-sm text-neutral-600">{currentView.description}</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {currentView.columns.filter(col => col.visible).map(column => (
                      <TableHead key={column.id}>{column.name}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record, index) => (
                    <TableRow key={record.id || index}>
                      {currentView.columns.filter(col => col.visible).map(column => (
                        <TableCell key={column.id}>
                          <div>
                            {column.linkedTable ? (
                              <Badge variant="outline" className="flex items-center">
                                <Link className="w-3 h-3 mr-1"/>
                                {record[column.id]}
                              </Badge>
                            ) : (
                              <span>{String(record[column.id] || '')}</span>
                            )}
                          </div>
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewRecord?.(currentView.id, record.id)}
                          >
                            <Eye className="w-4 h-4"/>
                          </Button>
                          {canWrite && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditRecord?.(currentView.id, record.id)}
                            >
                              <Settings className="w-4 h-4"/>
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteRecord?.(currentView.id, record.id)}
                            >
                              <EyeOff className="w-4 h-4"/>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Linked Records Display */}
              {currentView.linkedViews.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Linked Records</h4>
                  {filteredRecords.slice(0, 3).map((record, index) => (
                    <div key={record.id || index} className="mb-3">
                      {renderLinkedRecords(record, currentView.linkedViews)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 mx-auto mb-4 text-neutral-400"/>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Access Restricted</h3>
              <p className="text-neutral-600">
                You don&apos;t have permission to view this database view.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* RBAC Settings Dialog */}
      <Dialog open={showRBACDialog} onOpenChange={setShowRBACDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>RBAC/RLS Settings</DialogTitle>
            <DialogDescription>
              Configure role-based access control and row-level security for this view.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Roles */}
            <div>
              <h4 className="font-medium mb-3">User Roles</h4>
              <div className="space-y-2">
                {currentView.rbac.roles.map(role => (
                  <div key={role.userId} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{role.userName}</div>
                      <div className="text-sm text-neutral-600">Role: {role.role}</div>
                    </div>
                    <div className="flex space-x-1">
                      {role.permissions.map(perm => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RLS Policies */}
            <div>
              <h4 className="font-medium mb-3">Row-Level Security Policies</h4>
              <div className="space-y-2">
                {currentView.rbac.rlsPolicies.map(policy => (
                  <div key={policy.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{policy.name}</div>
                      <div className="text-sm text-neutral-600">{policy.condition}</div>
                    </div>
                    <div className="flex space-x-1">
                      {policy.roles.map(role => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowRBACDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Records Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Record Link</DialogTitle>
            <DialogDescription>
              Create relationships between records in different tables.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Link functionality would allow connecting records across different database views,
              creating one-to-one, one-to-many, and many-to-many relationships with proper RBAC controls.
            </p>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowLinkDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
