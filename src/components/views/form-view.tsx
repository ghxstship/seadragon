import React, { useState } from 'react'
import { validateEmail } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Eye,
  Save,
  Send,
  MoreHorizontal
} from 'lucide-react'

// Form field and data interfaces
interface FormField {
  id: string
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'email' | 'number' | 'date'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  value?: string | number | boolean | string[]
}

interface FormData {
  id: string
  title: string
  description?: string
  fields: FormField[]
}

interface FormViewProps {
  form?: FormData
  onSubmit?: (data: Record<string, string | number | boolean | string[]>) => void
  onSave?: (form: FormData) => void
  isGuest?: boolean
  isEditing?: boolean
}

export function FormView({
  form,
  onSubmit,
  onSave,
  isGuest = false,
  isEditing = false
}: FormViewProps) {
  const [formData, setFormData] = useState<Record<string, string | number | boolean | string[]>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFieldChange = (fieldId: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    form?.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = 'This field is required'
      }
      if (field.type === 'email' && formData[field.id]) {
        const emailValue = formData[field.id]
        const normalizedEmail = typeof emailValue === 'string' ? emailValue : String(emailValue)
        const validation = validateEmail(normalizedEmail)
        if (!validation.isValid) {
          newErrors[field.id] = validation.errors[0] || 'Please enter a valid email address'
        }
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit?.(formData)
    }
  }

  const renderField = (field: FormField) => {
    const rawValue = formData[field.id] ?? field.value
    const stringValue = rawValue === undefined || rawValue === null
      ? ''
      : Array.isArray(rawValue)
        ? ''
        : String(rawValue)

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={stringValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            disabled={isGuest && !isEditing}/>
        )

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={stringValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(field.id, e.target.value)}
            rows={3}
            disabled={isGuest && !isEditing}/>
        )

      case 'select':
        return (
          <Select
            value={typeof rawValue === 'string' ? rawValue : ''}
            onValueChange={(value: string) => handleFieldChange(field.id, value)}
            disabled={isGuest && !isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'}/>
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'radio':
        return (
          <RadioGroup
            value={typeof rawValue === 'string' ? rawValue : ''}
            onValueChange={(value: string) => handleFieldChange(field.id, value)}
            disabled={isGuest && !isEditing}
          >
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`}/>
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={Array.isArray(rawValue) ? rawValue.includes(option) : false}
                  onCheckedChange={(checked: boolean | 'indeterminate') => {
                    const currentValues = Array.isArray(rawValue) ? rawValue : []
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option)
                    handleFieldChange(field.id, newValues)
                  }}
                  disabled={isGuest && !isEditing}/>
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case 'date':
        return (
          <Input
            type="date"
            value={stringValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.id, e.target.value)}
            disabled={isGuest && !isEditing}/>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="bg-background border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{form?.title || 'Untitled Form'}</h1>
            {form?.description && (
              <p className="text-sm text-neutral-600 mt-1">{form.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isEditing && !isGuest && (
              <>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1"/>
                  Add Field
                </Button>
                <Button size="sm" onClick={() => form && onSave?.(form)}>
                  <Save className="w-4 h-4 mr-1"/>
                  Save
                </Button>
              </>
            )}

            {!isEditing && (
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1"/>
                Preview
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem disabled={isGuest}>
                  Form Settings
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isGuest}>
                  Share Form
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem disabled={isGuest}>
                  Duplicate Form
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isGuest}>
                  Delete Form
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {form?.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-semantic-error ml-1">*</span>}
                    </Label>
                    {renderField(field)}
                    {errors[field.id] && (
                      <p className="text-sm text-semantic-error">{errors[field.id]}</p>
                    )}
                  </div>
                ))}

                {!isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isGuest}>
                      <Send className="w-4 h-4 mr-1"/>
                      Submit Form
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
