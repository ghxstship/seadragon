# OpusZero Component Library Documentation

## Overview

The OpusZero component library provides 24 enterprise-grade UI components designed for building scalable workflow applications. All components follow semantic design principles, support TypeScript, and are fully accessible.

## Component Categories

### Form & Data Entry Components

#### FormBuilder
A comprehensive form builder with drag-and-drop interface, validation, and dynamic field management.

**Basic Usage:**
```tsx
import { FormBuilder } from '@/components/forms/form-builder'

const MyForm = () => {
  const [formData, setFormData] = useState({})

  return (
    <FormBuilder
      initialForm={{
        title: 'Contact Form',
        description: 'Please fill out your contact information',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            required: true,
            placeholder: 'Enter your full name'
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            required: true,
            validation: {
              pattern: '^[^@]+@[^@]+\\.[^@]+$'
            }
          }
        ]
      }}
      onSave={(data) => console.log('Form saved:', data)}
      onPreview={(data) => console.log('Form preview:', data)}
    />
  )
}
```

**Props:**
- `initialForm: FormData` - Initial form configuration
- `onSave?: (data: any) => void` - Save callback
- `onPreview?: (data: any) => void` - Preview callback
- `className?: string` - Additional CSS classes

#### MultiStepWizard
A multi-step form wizard with progress tracking and navigation controls.

**Basic Usage:**
```tsx
import { MultiStepWizard } from '@/components/forms/multi-step-wizard'

const MyWizard = () => {
  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      fields: [
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true }
      ]
    },
    {
      id: 'contact',
      title: 'Contact Details',
      description: 'How can we reach you?',
      fields: [
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone', type: 'tel' }
      ]
    }
  ]

  return (
    <MultiStepWizard
      steps={steps}
      onComplete={(data) => console.log('Wizard completed:', data)}
      onCancel={() => console.log('Wizard cancelled')}
    />
  )
}
```

### Layout & Display Components

#### ListLayout
A comprehensive list view with filtering, sorting, search, and bulk actions.

**Basic Usage:**
```tsx
import { ListLayout } from '@/components/layouts/list-layout'

const MyList = () => {
  const data = [
    { id: '1', name: 'Item 1', status: 'active', createdAt: '2024-01-01' },
    { id: '2', name: 'Item 2', status: 'inactive', createdAt: '2024-01-02' }
  ]

  return (
    <ListLayout
      title="My Items"
      totalItems={data.length}
      currentPage={1}
      pageSize={10}
      filters={[
        {
          id: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ]
        }
      ]}
      sortOptions={[
        { id: 'name', label: 'Name', value: 'asc' },
        { id: 'createdAt', label: 'Date Created', value: 'desc' }
      ]}
      bulkActions={[
        { id: 'delete', label: 'Delete', onClick: (ids) => handleDelete(ids) },
        { id: 'export', label: 'Export', onClick: (ids) => handleExport(ids) }
      ]}
      selectable={true}
    >
      <div className="space-y-4">
        {data.map(item => (
          <div key={item.id} className="p-4 border rounded">
            <h3>{item.name}</h3>
            <p>Status: {item.status}</p>
          </div>
        ))}
      </div>
    </ListLayout>
  )
}
```

#### DetailLayout
A comprehensive detail view with breadcrumbs, actions, tabs, and related items.

**Basic Usage:**
```tsx
import { DetailLayout } from '@/components/layouts/detail-layout'

const MyDetailView = () => {
  return (
    <DetailLayout
      title="Project Details"
      breadcrumbs={[
        { label: 'Projects', href: '/projects' },
        { label: 'Project Alpha', href: '/projects/alpha' }
      ]}
      actions={[
        { label: 'Edit', onClick: () => {}, variant: 'outline' },
        { label: 'Delete', onClick: () => {}, variant: 'destructive' }
      ]}
      tabs={[
        { id: 'overview', label: 'Overview', content: <div>Overview content</div> },
        { id: 'details', label: 'Details', content: <div>Details content</div> }
      ]}
      relatedItems={[
        {
          id: '1',
          title: 'Related Project',
          description: 'Another related project',
          type: 'project',
          onClick: () => {}
        }
      ]}
    />
  )
}
```

### Data Visualization Components

#### AnalyticsChart
A versatile chart component supporting multiple chart types with responsive design.

**Basic Usage:**
```tsx
import { AnalyticsChart } from '@/components/visualization/analytics-chart'

const MyChart = () => {
  const data = [
    { label: 'Jan', value: 100, category: 'Sales' },
    { label: 'Feb', value: 120, category: 'Sales' },
    { label: 'Mar', value: 150, category: 'Sales' }
  ]

  return (
    <AnalyticsChart
      type="line"
      data={data}
      title="Monthly Sales"
      xAxisLabel="Month"
      yAxisLabel="Revenue ($)"
      showLegend={true}
      showGrid={true}
    />
  )
}
```

#### ComparisonMatrix
A matrix component for comparing multiple items across various criteria.

**Basic Usage:**
```tsx
import { ComparisonMatrix } from '@/components/visualization/comparison-matrix'

const MyComparison = () => {
  const items = [
    { id: '1', name: 'Candidate A', role: 'Developer' },
    { id: '2', name: 'Candidate B', role: 'Designer' }
  ]

  const features = [
    { id: 'exp', label: 'Experience', type: 'rating' },
    { id: 'skills', label: 'Technical Skills', type: 'rating' },
    { id: 'culture', label: 'Culture Fit', type: 'rating' }
  ]

  return (
    <ComparisonMatrix
      items={items}
      features={features}
      onItemSelect={(itemId) => console.log('Selected:', itemId)}
      onFeatureUpdate={(itemId, featureId, value) =>
        console.log('Updated:', itemId, featureId, value)
      }
    />
  )
}
```

### Workflow Components

#### WorkflowDesigner
A visual workflow designer with drag-and-drop functionality and real-time collaboration.

**Basic Usage:**
```tsx
import { WorkflowDesigner } from '@/components/workflow/workflow-designer'

const MyWorkflowDesigner = () => {
  const [nodes, setNodes] = useState([
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      position: { x: 100, y: 100 },
      data: { status: 'active' }
    }
  ])

  const [connections, setConnections] = useState([])

  return (
    <WorkflowDesigner
      nodes={nodes}
      connections={connections}
      onNodeAdd={(node) => setNodes(prev => [...prev, node])}
      onNodeUpdate={(nodeId, updates) => {
        setNodes(prev => prev.map(node =>
          node.id === nodeId ? { ...node, ...updates } : node
        ))
      }}
      onNodeDelete={(nodeId) => {
        setNodes(prev => prev.filter(node => node.id !== nodeId))
      }}
      onConnectionAdd={(connection) => setConnections(prev => [...prev, connection])}
      onConnectionDelete={(connectionId) => {
        setConnections(prev => prev.filter(conn => conn.id !== connectionId))
      }}
      onSave={(workflow) => console.log('Workflow saved:', workflow)}
    />
  )
}
```

#### KanbanBoard
An interactive Kanban board with drag-and-drop functionality and customizable columns.

**Basic Usage:**
```tsx
import { KanbanBoard } from '@/components/workflow/kanban-board'

const MyKanbanBoard = () => {
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Task 1', description: 'Description 1' }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      cards: []
    }
  ])

  return (
    <KanbanBoard
      columns={columns}
      onCardMove={(cardId, fromColumnId, toColumnId) => {
        // Handle card movement logic
      }}
      onCardAdd={(columnId, card) => {
        // Handle card addition logic
      }}
      onCardUpdate={(cardId, updates) => {
        // Handle card updates logic
      }}
    />
  )
}
```

### Content Components

#### DocumentViewer
A comprehensive document viewer supporting multiple formats with advanced features.

**Basic Usage:**
```tsx
import { DocumentViewer } from '@/components/content/document-viewer'

const MyDocumentViewer = () => {
  return (
    <DocumentViewer
      document={{
        id: 'doc-001',
        name: 'sample-document.pdf',
        type: 'document',
        size: 2048000,
        url: '/api/documents/doc-001.pdf',
        pages: 12,
        lastModified: new Date('2024-01-15'),
        author: 'John Doe'
      }}
    />
  )
}
```

#### StatusIndicator
A status indicator component with customizable states and animations.

**Basic Usage:**
```tsx
import { StatusIndicator } from '@/components/content/status-indicator'

const MyStatusIndicator = () => {
  const statuses = [
    {
      id: '1',
      label: 'Draft',
      status: 'draft',
      description: 'Content is being drafted'
    },
    {
      id: '2',
      label: 'Review',
      status: 'review',
      description: 'Content is under review'
    },
    {
      id: '3',
      label: 'Published',
      status: 'published',
      description: 'Content is live'
    }
  ]

  return (
    <StatusIndicator
      items={statuses}
      currentStatus="review"
      onStatusChange={(statusId) => console.log('Status changed to:', statusId)}
    />
  )
}
```

## UI Primitive Components

The library includes a complete set of shadcn/ui primitives:

### Button Variants
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Form Components
```tsx
import { Input, Textarea, Select, Checkbox, RadioGroup } from '@/components/ui'

// Input with validation
<Input
  type="email"
  placeholder="Enter your email"
  required
/>

// Select with options
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Layout Components
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Card layout
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>

// Tabs
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Tab 1 content</TabsContent>
  <TabsContent value="tab2">Tab 2 content</TabsContent>
</Tabs>
```

## Theming & Styling

### Design System
All components follow a consistent design system with:
- **Colors**: Semantic color palette (primary, secondary, success, warning, error)
- **Typography**: Consistent font scales and weights
- **Spacing**: Standardized spacing scale (4px increments)
- **Shadows**: Consistent shadow system for depth
- **Borders**: Unified border radius and styles

### Dark Mode Support
All components support dark mode automatically through CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

### Customization
Components can be customized using CSS variables or Tailwind classes:

```tsx
// Using className prop
<FormBuilder className="max-w-4xl mx-auto" />

// Custom styling with CSS
.custom-form {
  --border-radius: 12px;
  --shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

## Accessibility

### WCAG 2.1 AA Compliance
All components are designed to meet WCAG 2.1 AA accessibility standards:
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks

### Keyboard Shortcuts
Common keyboard shortcuts across components:
- `Tab`: Navigate between focusable elements
- `Enter/Space`: Activate buttons and controls
- `Escape`: Close dialogs and menus
- `Arrow Keys`: Navigate lists and grids

## Performance

### Optimization Features
- **Lazy Loading**: Components load only when needed
- **Code Splitting**: Automatic bundle splitting
- **Tree Shaking**: Unused code elimination
- **Memoization**: React.memo and useMemo usage
- **Virtual Scrolling**: For large lists and tables

### Bundle Size
Current bundle sizes (approximate):
- **Core Components**: ~45KB gzipped
- **UI Primitives**: ~25KB gzipped
- **Icons**: ~15KB gzipped
- **Total**: ~85KB gzipped

## Browser Support

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Support
- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Samsung Internet**: 15+

## Migration Guide

### From Legacy Components
If migrating from older component libraries:

1. **Update Imports**:
   ```tsx
   // Old
   import { OldButton } from '@/components/old-library'

   // New
   import { Button } from '@/components/ui/button'
   ```

2. **Update Props**:
   ```tsx
   // Old
   <OldButton primary>Click me</OldButton>

   // New
   <Button variant="default">Click me</Button>
   ```

3. **Update Styling**:
   ```tsx
   // Old (custom CSS)
   <OldButton className="custom-btn" />

   // New (Tailwind)
   <Button className="bg-blue-500 text-white hover:bg-blue-600" />
   ```

## Contributing

### Component Development Guidelines
1. **TypeScript**: All components must be fully typed
2. **Accessibility**: WCAG 2.1 AA compliance required
3. **Testing**: Unit tests with 90%+ coverage
4. **Documentation**: Storybook stories and usage examples
5. **Performance**: Optimize for bundle size and runtime performance

### Testing
```bash
# Run all tests
npm run test:coverage

# Run specific component tests
npm run test -- --testPathPattern=FormBuilder

# Run E2E tests
npm run test:e2e
```

## Support & Resources

- **Documentation**: https://docs.opuszero.com/components
- **Storybook**: https://storybook.opuszero.com
- **GitHub**: https://github.com/opuszero/components
- **Discord**: https://discord.gg/opuszero
- **Issues**: https://github.com/opuszero/components/issues

## Changelog

### v1.0.0
- Initial release with 24 enterprise components
- Full TypeScript support
- WCAG 2.1 AA accessibility compliance
- Comprehensive test coverage
- Production-ready performance optimizations
