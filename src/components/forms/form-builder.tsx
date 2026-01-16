
import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Trash2,
  Settings,
  Eye,
  Save,
  GripVertical,
  Type,
  Hash,
  List,
  Calendar,
  FileText,
  CheckSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FormField {
  id: string
  type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox' | 'file'
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    customMessage?: string
  }
}

export interface FormBuilderProps {
  initialFields?: FormField[]
  initialForm?: { fields: FormField[]; title?: string; description?: string }
  onSave?: (fields: FormField[]) => void
  onPreview?: (fields: FormField[]) => void
  className?: string
  title?: string
}

export interface FormFieldEditorProps {
  field: FormField
  onUpdate: (field: FormField) => void
  onDelete: () => void
}

const fieldTypeIcons = {
  text: Type,
  number: Hash,
  select: List,
  date: Calendar,
  textarea: FileText,
  checkbox: CheckSquare,
  file: FileText,
}

const fieldTypeLabels = {
  text: 'Text Input',
  number: 'Number Input',
  select: 'Select Dropdown',
  date: 'Date Picker',
  textarea: 'Text Area',
  checkbox: 'Checkbox',
  file: 'File Upload',
}

function FormFieldEditor({ field, onUpdate, onDelete }: FormFieldEditorProps) {
  const Icon = fieldTypeIcons[field.type]

  const updateField = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates })
  }

  return (
    <Card className="mb-3">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-semantic-info"/>
            <CardTitle className="text-sm">{field.label || 'Untitled Field'}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {fieldTypeLabels[field.type]}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-semantic-error hover:text-semantic-error hover:bg-semantic-error/10"
            >
              <Trash2 className="w-3 h-3"/>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`label-${field.id}`} className="text-sm font-medium">
              Field Label
            </Label>
            <Input
              id={`label-${field.id}`}
              value={field.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Enter field label"
              className="mt-1"/>
          </div>
          <div>
            <Label htmlFor={`type-${field.id}`} className="text-sm font-medium">
              Field Type
            </Label>
            <Select
              value={field.type}
              onValueChange={(value: FormField['type']) => updateField({ type: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="number">Number Input</SelectItem>
                <SelectItem value="select">Select Dropdown</SelectItem>
                <SelectItem value="date">Date Picker</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor={`placeholder-${field.id}`} className="text-sm font-medium">
            Placeholder Text (Optional)
          </Label>
          <Input
            id={`placeholder-${field.id}`}
            value={field.placeholder || ''}
            onChange={(e) => updateField({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
            className="mt-1"/>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Checkbox
            id={`required-${field.id}`}
            checked={field.required || false}
            onCheckedChange={(checked) => updateField({ required: checked as boolean })}/>
          <Label htmlFor={`required-${field.id}`} className="text-sm">
            Required field
          </Label>
        </div>

        {field.type === 'select' && (
          <div className="mt-4">
            <Label className="text-sm font-medium">Options (one per line)</Label>
            <Textarea
              value={field.options?.join('\n') || ''}
              onChange={(e) => updateField({ options: e.target.value.split('\n').filter(Boolean) })}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              className="mt-1"
              rows={3}/>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function FormBuilder({
  initialFields = [],
  initialForm,
  onSave,
  onPreview,
  className,
  title = "Form Builder"
}: FormBuilderProps) {
  const resolvedFields = initialForm?.fields ?? initialFields
  const [fields, setFields] = useState<FormField[]>(resolvedFields)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const addField = useCallback((type: FormField['type']) => {
    const newField: FormField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `New ${fieldTypeLabels[type]} Field`,
      required: false,
    }

    if (type === 'select') {
      newField.options = ['Option 1', 'Option 2', 'Option 3']
    }

    setFields(prev => [...prev, newField])
  }, [])

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    ))
  }, [])

  const deleteField = useCallback((fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId))
  }, [])

  const moveField = useCallback((fromIndex: number, toIndex: number) => {
    setFields(prev => {
      const newFields = [...prev]
      const [moved] = newFields.splice(fromIndex, 1)
      newFields.splice(toIndex, 0, moved)
      return newFields
    })
  }, [])

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    moveField(draggedIndex, index)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          {title}
        </h1>
        <p className="text-muted-foreground">
          Build custom forms with drag-and-drop field creation. All components use semantic tokens for consistent theming.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Palette */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(fieldTypeLabels).map(([type, label]) => {
                  const Icon = fieldTypeIcons[type as FormField['type']]
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center space-y-2"
                      onClick={() => addField(type as FormField['type'])}
                    >
                      <Icon className="w-5 h-5 text-semantic-info"/>
                      <span className="text-xs text-center">{label}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Builder Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Form Fields</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview?.(fields)}
                    disabled={fields.length === 0}
                  >
                    <Eye className="w-4 h-4 mr-2"/>
                    Preview
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onSave?.(fields)}
                  >
                    <Save className="w-4 h-4 mr-2"/>
                    Save Form
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                  <p>No fields added yet. Click a field type to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "flex items-start space-x-3 p-3 rounded-lg border bg-background cursor-move",
                        draggedIndex === index && "opacity-50"
                      )}
                    >
                      <GripVertical className="w-4 h-4 mt-2 text-muted-foreground"/>
                      <div className="flex-1">
                        <FormFieldEditor
                          field={field}
                          onUpdate={(updatedField) => updateField(field.id, updatedField)}
                          onDelete={() => deleteField(field.id)}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default FormBuilder
