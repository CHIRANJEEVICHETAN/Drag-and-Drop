# 🎯 Dashboard Builder

A powerful, customizable drag & drop dashboard builder for React applications. Build interactive dashboards with widgets, templates, and real-time data visualization.

## ✨ Features

- 🖱️ **Drag & Drop**: Intuitive widget placement and arrangement
- 📱 **Responsive Grid**: Adaptive layout system with breakpoints
- 🎨 **Customizable**: Extensive theming and configuration options
- 📊 **Widget Library**: Built-in charts, metrics, and custom widgets
- 💾 **Templates**: Save and load dashboard configurations
- ↩️ **History**: Undo/redo functionality for all changes
- 🔌 **Plugin System**: Extensible architecture for custom features
- 📦 **TypeScript**: Full type safety and IntelliSense support

## 🚀 Quick Start

### Installation

```bash
npm install @your-org/dashboard-builder
# or
yarn add @your-org/dashboard-builder
# or
pnpm add @your-org/dashboard-builder
```

### Basic Usage

```tsx
import { DashboardBuilder } from '@your-org/dashboard-builder'

function App() {
  return (
    <DashboardBuilder
      config={{
        title: 'My Dashboard',
        gridCols: 12,
        rowHeight: 60,
        enableTemplates: true,
        enableHistory: true,
      }}
      onWidgetAdd={(widget) => console.log('Widget added:', widget)}
      onLayoutChange={(layout) => console.log('Layout changed:', layout)}
    />
  )
}
```

## 🎛️ Configuration Options

### Dashboard Configuration

```tsx
const dashboardConfig = {
  // Layout settings
  gridCols: 12,                    // Number of grid columns
  rowHeight: 60,                   // Height of each grid row
  margin: [12, 12],               // Margin between widgets [x, y]
  containerPadding: [16, 16],     // Container padding [x, y]
  
  // Features
  enableDragAndDrop: true,         // Enable drag & drop
  enableResize: true,              // Enable widget resizing
  enableTemplates: true,           // Enable template system
  enableHistory: true,             // Enable undo/redo
  enableAutoArrange: true,         // Enable auto-arrangement
  
  // Styling
  theme: 'auto',                   // 'light' | 'dark' | 'auto'
  backgroundColor: 'bg-blue-50',   // Custom background
  borderRadius: 12,                // Widget border radius
  shadow: 'shadow-xl',             // Widget shadow style
  
  // Behavior
  compactType: 'vertical',         // 'vertical' | 'horizontal' | null
  preventCollision: false,         // Prevent widget overlap
  useCSSTransforms: true,          // Use CSS transforms for performance
}
```

### Widget Library Configuration

```tsx
const widgetLibraryConfig = {
  categories: ['charts', 'metrics', 'custom'],  // Available categories
  showSearch: true,                             // Show search bar
  showCategories: true,                         // Show category filters
  maxWidgets: 100,                              // Maximum widgets allowed
  customWidgets: [                              // Custom widget types
    {
      id: 'custom-widget',
      name: 'Custom Widget',
      icon: CustomIcon,
      component: CustomWidget,
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 2, h: 2 },
      category: 'custom',
      description: 'A custom widget component'
    }
  ]
}
```

### Top Bar Configuration

```tsx
const topBarConfig = {
  show: true,                      // Show/hide top bar
  title: 'My Dashboard',           // Dashboard title
  showTemplateActions: true,       // Show template buttons
  showExportImport: true,          // Show export/import buttons
  showUndoRedo: true,              // Show undo/redo buttons
  customActions: <CustomButton />, // Custom action buttons
}
```

## 🧩 Custom Widgets

### Creating a Custom Widget

```tsx
import { BaseWidget } from '@your-org/dashboard-builder'

interface CustomWidgetProps {
  id: string
  title?: string
  config: {
    data: any[]
    color: string
  }
}

export function CustomWidget({ id, title, config }: CustomWidgetProps) {
  return (
    <BaseWidget id={id} title={title}>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Custom Data</h3>
        <div className="space-y-2">
          {config.data.map((item, index) => (
            <div 
              key={index}
              className="p-2 rounded"
              style={{ backgroundColor: config.color }}
            >
              {item.name}: {item.value}
            </div>
          ))}
        </div>
      </div>
    </BaseWidget>
  )
}
```

### Registering Custom Widgets

```tsx
import { DashboardBuilder } from '@your-org/dashboard-builder'
import { CustomWidget } from './CustomWidget'

const customWidgets = [
  {
    id: 'custom-widget',
    name: 'Custom Widget',
    icon: CustomIcon,
    component: CustomWidget,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 2, h: 2 },
    category: 'custom',
    description: 'A custom widget component'
  }
]

function App() {
  return (
    <DashboardBuilder
      widgetLibrary={{
        customWidgets,
        categories: ['charts', 'metrics', 'custom']
      }}
    />
  )
}
```

## 📊 Data Integration

### Real-time Data Updates

```tsx
import { useDashboardStore } from '@your-org/dashboard-builder'

function DataProvider() {
  const { updateWidget } = useDashboardStore()
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Update widget with new data
      updateWidget('widget-1', {
        config: {
          value: Math.random() * 100,
          timestamp: new Date().toISOString()
        }
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [updateWidget])
  
  return null
}
```

### External Data Sources

```tsx
function DashboardWithData() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    // Fetch data from API
    fetch('/api/dashboard-data')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  const initialWidgets = useMemo(() => {
    if (!data) return []
    
    return [
      {
        type: 'bar-chart',
        title: 'Sales Data',
        config: { data: data.sales },
        layout: { x: 0, y: 0, w: 6, h: 4, i: 'sales-chart' }
      }
    ]
  }, [data])
  
  return (
    <DashboardBuilder
      initialWidgets={initialWidgets}
      onWidgetAdd={(widget) => {
        // Handle widget addition
        console.log('New widget:', widget)
      }}
    />
  )
}
```

## 🎨 Theming and Styling

### Custom CSS Variables

```css
:root {
  --dashboard-primary: #3b82f6;
  --dashboard-secondary: #64748b;
  --dashboard-background: #f8fafc;
  --dashboard-border: #e2e8f0;
  --dashboard-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.dashboard-builder {
  --widget-border-radius: 12px;
  --widget-padding: 16px;
  --widget-margin: 12px;
}
```

### Custom Styling

```tsx
<DashboardBuilder
  config={{
    backgroundColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    borderRadius: 16,
    shadow: 'shadow-2xl',
  }}
  className="custom-dashboard"
  style={{
    '--custom-color': '#8b5cf6',
    '--custom-spacing': '24px',
  } as React.CSSProperties}
/>
```

## 🔌 Plugin System

### Creating a Plugin

```tsx
import { DashboardPlugin } from '@your-org/dashboard-builder'

class AnalyticsPlugin implements DashboardPlugin {
  id = 'analytics'
  name = 'Analytics Plugin'
  version = '1.0.0'
  
  initialize(dashboard: any) {
    // Initialize plugin
    console.log('Analytics plugin initialized')
  }
  
  destroy() {
    // Cleanup
    console.log('Analytics plugin destroyed')
  }
  
  onWidgetAdd(widget: any) {
    // Track widget addition
    analytics.track('widget_added', { type: widget.type })
  }
}

// Usage
const plugins = [new AnalyticsPlugin()]
```

## 📱 Responsive Design

### Breakpoint Configuration

```tsx
const responsiveConfig = {
  breakpoints: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0
  },
  cols: {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2
  }
}

<DashboardBuilder
  config={{
    gridCols: 12,
    ...responsiveConfig
  }}
/>
```

## 🧪 Testing

### Component Testing

```tsx
import { render, screen } from '@testing-library/react'
import { DashboardBuilder } from '@your-org/dashboard-builder'

test('renders dashboard with title', () => {
  render(
    <DashboardBuilder
      topBar={{ title: 'Test Dashboard' }}
    />
  )
  
  expect(screen.getByText('Test Dashboard')).toBeInTheDocument()
})
```

### Widget Testing

```tsx
import { render } from '@testing-library/react'
import { BaseWidget } from '@your-org/dashboard-builder'

test('renders widget with title', () => {
  render(
    <BaseWidget id="test" title="Test Widget">
      <div>Widget content</div>
    </BaseWidget>
  )
  
  expect(screen.getByText('Test Widget')).toBeInTheDocument()
})
```

## 📦 Advanced Usage

### Programmatic Control

```tsx
import { useDashboardStore } from '@your-org/dashboard-builder'

function DashboardController() {
  const { 
    addWidget, 
    removeWidget, 
    updateLayout,
    autoArrange 
  } = useDashboardStore()
  
  const addChartWidget = () => {
    addWidget({
      type: 'bar-chart',
      title: 'New Chart',
      config: { data: [] },
      layout: { x: 0, y: 0, w: 6, h: 4, i: `chart-${Date.now()}` }
    })
  }
  
  const resetLayout = () => {
    autoArrange('compact')
  }
  
  return (
    <div className="space-x-2">
      <button onClick={addChartWidget}>Add Chart</button>
      <button onClick={resetLayout}>Reset Layout</button>
    </div>
  )
}
```

### Template Management

```tsx
function TemplateManager() {
  const { 
    saveTemplate, 
    loadTemplate, 
    templates,
    currentTemplate 
  } = useDashboardStore()
  
  const saveCurrentAsTemplate = () => {
    const name = prompt('Template name:')
    if (name) {
      saveTemplate(name)
    }
  }
  
  return (
    <div>
      <button onClick={saveCurrentAsTemplate}>
        Save as Template
      </button>
      
      <select 
        value={currentTemplate?.id || ''} 
        onChange={(e) => loadTemplate(e.target.value)}
      >
        <option value="">Select Template</option>
        {templates.map(template => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
    </div>
  )
}
```

## 🚀 Performance Optimization

### Lazy Loading Widgets

```tsx
import { lazy, Suspense } from 'react'

const LazyWidget = lazy(() => import('./HeavyWidget'))

function OptimizedDashboard() {
  return (
    <DashboardBuilder
      config={{
        enableLazyLoading: true,
        widgetRenderThreshold: 5, // Only render visible widgets
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LazyWidget />
      </Suspense>
    </DashboardBuilder>
  )
}
```

### Virtual Scrolling

```tsx
<DashboardBuilder
  config={{
    enableVirtualScrolling: true,
    virtualScrollThreshold: 100, // Enable for 100+ widgets
    virtualScrollItemHeight: 60,
  }}
/>
```

## 🔧 Troubleshooting

### Common Issues

1. **Widgets not rendering**: Check if widget components are properly exported
2. **Drag & drop not working**: Ensure `enableDragAndDrop: true` is set
3. **Layout not saving**: Verify `enableHistory: true` is enabled
4. **Styling conflicts**: Use CSS specificity or `!important` for overrides

### Debug Mode

```tsx
<DashboardBuilder
  config={{
    debug: true, // Enable debug logging
    logLevel: 'verbose', // 'error' | 'warn' | 'info' | 'verbose'
  }}
/>
```

## 📚 API Reference

### DashboardBuilder Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `DashboardConfig` | `{}` | Dashboard configuration |
| `widgetLibrary` | `WidgetLibraryConfig` | `{}` | Widget library settings |
| `topBar` | `TopBarConfig` | `{}` | Top bar configuration |
| `initialWidgets` | `Widget[]` | `[]` | Initial widgets to display |
| `initialLayout` | `WidgetLayout[]` | `[]` | Initial layout configuration |
| `className` | `string` | `""` | Additional CSS classes |
| `style` | `CSSProperties` | `{}` | Inline styles |
| `children` | `ReactNode` | `undefined` | Custom content |
| `onReady` | `function` | `undefined` | Dashboard ready callback |
| `onError` | `function` | `undefined` | Error handler |

### Events

| Event | Description | Payload |
|-------|-------------|---------|
| `onWidgetAdd` | Widget added to dashboard | `Widget` |
| `onWidgetRemove` | Widget removed from dashboard | `string` (widget ID) |
| `onWidgetUpdate` | Widget updated | `string` (widget ID), `Partial<Widget>` |
| `onLayoutChange` | Layout changed | `WidgetLayout[]` |
| `onTemplateSave` | Template saved | `DashboardTemplate` |
| `onTemplateLoad` | Template loaded | `DashboardTemplate` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://github.com/your-org/dashboard-builder)
- 🐛 [Issues](https://github.com/your-org/dashboard-builder/issues)
- 💬 [Discussions](https://github.com/your-org/dashboard-builder/discussions)
- 📧 [Email](mailto:support@your-org.com)

---

Made with ❤️ by [Your Organization](https://your-org.com)
