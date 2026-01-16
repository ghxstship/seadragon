
import { useMemo, useRef, useState } from 'react'
import { createSafeHtml, createSafeMarkdownHtml } from '@/lib/sanitize'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Save,
  Edit,
  Eye,
  Share,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DocsViewProps {
  doc?: {
    id: string
    title: string
    content: string
    lastModified: Date
    author: {
      id: string
      name: string
    }
  }
  onSave?: (title: string, content: string) => void
  onShare?: () => void
  isGuest?: boolean
}

export function DocsView({
  doc,
  onSave,
  onShare,
  isGuest = false
}: DocsViewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isEditing, setIsEditing] = useState(!doc?.content)
  const [title, setTitle] = useState(doc?.title || 'Untitled Document')
  const [content, setContent] = useState(doc?.content || '')

  const hasUnsavedChanges = useMemo(() => {
    return content !== (doc?.content || '') || title !== (doc?.title || 'Untitled Document')
  }, [content, title, doc])

  const handleSave = () => {
    onSave?.(title, content)
  }

  const insertFormatting = (format: string) => {
    if (isGuest) return

    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = ''
    let newCursorPos = start

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`
        newCursorPos = selectedText ? end + 2 : start + 2
        break
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`
        newCursorPos = selectedText ? end + 1 : start + 1
        break
      case 'heading1':
        formattedText = `# ${selectedText || 'Heading 1'}\n`
        newCursorPos = start + formattedText.length
        break
      case 'heading2':
        formattedText = `## ${selectedText || 'Heading 2'}\n`
        newCursorPos = start + formattedText.length
        break
      case 'heading3':
        formattedText = `### ${selectedText || 'Heading 3'}\n`
        newCursorPos = start + formattedText.length
        break
      case 'list':
        formattedText = `- ${selectedText || 'List item'}\n`
        newCursorPos = start + formattedText.length
        break
      case 'ordered-list':
        formattedText = `1. ${selectedText || 'Ordered list item'}\n`
        newCursorPos = start + formattedText.length
        break
      case 'link':
        formattedText = `[${selectedText || 'link text'}](url)`
        newCursorPos = selectedText ? end + 3 : start + 14
        break
      case 'code':
        formattedText = `\`${selectedText || 'code'}\``
        newCursorPos = selectedText ? end + 1 : start + 1
        break
      case 'quote':
        formattedText = `> ${selectedText || 'Quote'}\n`
        newCursorPos = start + formattedText.length
        break
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)

    // Restore focus and cursor position after state updates
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(newCursorPos, newCursorPos)
    })
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold border-none p-0 h-auto focus:ring-0"
                placeholder="Document title..."
                disabled={isGuest}/>
            ) : (
              <h1 className="text-xl font-semibold">{title}</h1>
            )}

            {hasUnsavedChanges && (
              <span className="text-sm text-semantic-warning">• Unsaved changes</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {!isGuest && (
              <>
                {isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <Eye className="w-4 h-4 mr-1"/>
                    Preview
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-1"/>
                    Edit
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                >
                  <Save className="w-4 h-4 mr-1"/>
                  Save
                </Button>
              </>
            )}

            <Button variant="outline" size="sm" onClick={onShare}>
              <Share className="w-4 h-4 mr-1"/>
              Share
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem disabled={isGuest}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isGuest}>
                  Version History
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem disabled={isGuest}>
                  Delete Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Toolbar */}
        {isEditing && !isGuest && (
          <div className="flex items-center space-x-1 mt-4 p-2 bg-neutral-50 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('bold')}
              className="p-1 h-8 w-8"
            >
              <Bold className="w-4 h-4"/>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('italic')}
              className="p-1 h-8 w-8"
            >
              <Italic className="w-4 h-4"/>
            </Button>
            <div className="w-px h-6 bg-neutral-300 mx-1"/>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('heading1')}
              className="p-1 h-8 w-8"
            >
              <Heading1 className="w-4 h-4"/>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('heading2')}
              className="p-1 h-8 w-8"
            >
              <Heading2 className="w-4 h-4"/>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('heading3')}
              className="p-1 h-8 w-8"
            >
              <Heading3 className="w-4 h-4"/>
            </Button>
            <div className="w-px h-6 bg-neutral-300 mx-1"/>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('list')}
              className="p-1 h-8 w-8"
            >
              <List className="w-4 h-4"/>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('ordered-list')}
              className="p-1 h-8 w-8"
            >
              <ListOrdered className="w-4 h-4"/>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('quote')}
              className="p-1 h-8 w-8"
            >
              <Quote className="w-4 h-4"/>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('code')}
              className="p-1 h-8 w-8"
            >
              <Code className="w-4 h-4"/>
            </Button>
            <div className="w-px h-6 bg-neutral-300 mx-1"/>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('link')}
              className="p-1 h-8 w-8"
            >
              <Link className="w-4 h-4"/>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8"
            >
              <ImageIcon className="w-4 h-4" aria-hidden="true"/>
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your document..."
            className="w-full h-full min-h-96 border-none resize-none focus:ring-0 text-base leading-relaxed"
            disabled={isGuest}/>
        ) : (
          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={
              content
                ? createSafeMarkdownHtml(content)
                : createSafeHtml('<p class="text-neutral-500">No content yet. Click Edit to start writing.</p>')
            }/>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-200 px-6 py-3 text-sm text-neutral-500">
        {doc ? (
          <span>
            Last modified {new Date(doc.lastModified).toLocaleDateString()} by {doc.author?.name ?? 'Unknown'}
          </span>
        ) : (
          <span>New document</span>
        )}
      </div>
    </div>
  )
}
