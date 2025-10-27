# Ontology Visualization System Documentation

## Overview
This document describes the ontology visualization system implemented for the Multipult Frontend project. The system provides multiple interactive visualization types for exploring ontologies and concept relationships.

## Table of Contents
1. [Architecture](#architecture)
2. [Visualization Components](#visualization-components)
3. [Usage](#usage)
4. [API Reference](#api-reference)
5. [Navigation Integration](#navigation-integration)
6. [Features](#features)

## Architecture

The visualization system follows a modular architecture with the following structure:

```
src/
├── lib/
│   └── components/
│       └── visualization/
│           ├── ConceptFlow.svelte
│           ├── NetworkExplorer.svelte
│           ├── OntologyMap.svelte
│           ├── HierarchyTree.svelte
│           ├── GraphVisualization.svelte
│           ├── ThreeDVisualization.svelte
│           ├── RadialTreeVisualization.svelte
│           ├── MatrixVisualization.svelte
│           ├── LegendFilter.svelte
│           ├── ContextMenu.svelte
│           ├── exportUtils.ts
│           └── index.ts
└── routes/
    └── visualization/
        ├── +page.svelte
        ├── graph/
        ├── network/
        ├── hierarchy-tree/
        ├── flow/
        ├── ontology/
        ├── radial/
        ├── matrix/
        └── 3d/
```

## Visualization Components

### 1. ConceptFlow.svelte
Sankey diagrams for showing data flows between concepts.

**Features:**
- Interactive flow visualization
- Mouseover tooltips
- Responsive design
- Customizable width/height

**Props:**
- `data`: Sankey data with nodes and links
- `width`: Visualization width
- `height`: Visualization height
- `title`: Title of the visualization

### 2. NetworkExplorer.svelte
Interactive network graphs with search and filtering capabilities.

**Features:**
- Interactive node manipulation
- Search functionality
- Type filtering
- Context menu for nodes
- Draggable and zoomable canvas

**Props:**
- `data`: Network data with nodes and edges
- `width`: Width of the visualization
- `height`: Height of the visualization
- `title`: Title to display
- `options`: Vis-network options
- `enableSearch`: Enable search functionality
- `enableFilter`: Enable filtering

### 3. OntologyMap.svelte
Comprehensive ontology visualization with multiple view types.

**Features:**
- Multiple visualization modes (force, sankey, hierarchy)
- Zoom and pan functionality
- Interactive node manipulation

**Props:**
- `data`: Ontology data with nodes and edges
- `width`: Width of the visualization
- `height`: Height of the visualization
- `title`: Title to display
- `visualizationType`: Type of visualization (force, sankey, hierarchy)

### 4. HierarchyTree.svelte
Tree visualization for hierarchical concept structures.

**Features:**
- Collapsible/expandable nodes
- Interactive navigation
- Responsive design

**Props:**
- `data`: Hierarchical tree data
- `width`: Width of the visualization
- `height`: Height of the visualization
- `title`: Title to display
- `collapsible`: Enable node collapsing

### 5. GraphVisualization.svelte
Multi-type graph visualization supporting force-directed, network, and sankey views.

**Features:**
- Multiple visualization types
- Interactive nodes and edges
- Tooltips and hover effects
- Zoom and pan support

**Props:**
- `data`: Graph data with nodes and edges
- `width`: Width of the visualization
- `height`: Height of the visualization
- `title`: Title to display
- `visualizationType`: Type of visualization (force, sankey, network)
- `options`: Visualization options

### 6. ThreeDVisualization.svelte
Three-dimensional visualization of complex structures.

**Features:**
- 3D scene with orbit controls
- Interactive node manipulation
- Mouse events and selection
- SSR-safe implementation

**Props:**
- `data`: 3D node and edge data with positions
- `width`: Width of the visualization
- `height`: Height of the visualization
- `title`: Title to display

### 7. RadialTreeVisualization.svelte
Radial tree visualization for complex hierarchies.

**Features:**
- Radial layout for tree structures
- Zoom and pan support
- Interactive node details

**Props:**
- `data`: Hierarchical tree data
- `width`: Width of the visualization
- `height`: Height of the visualization
- `title`: Title to display
- `radius`: Radius of the radial layout

### 8. MatrixVisualization.svelte
Matrix visualization for showing relationships between concepts.

**Features:**
- Relationship matrix display
- Color-coded intensity
- Tooltips and hover details

**Props:**
- `data`: Matrix data with nodes and matrix values
- `width`: Width of the visualization
- `height`: Height of the visualization
- `title`: Title to display
- `cellSize`: Size of matrix cells

## Usage

### In Components
```svelte
<script>
  import { NetworkExplorer } from '$lib/components/visualization';
  
  let sampleData = {
    nodes: [
      { id: '1', label: 'Concept A', type: 'concept' },
      { id: '2', label: 'Concept B', type: 'entity' }
    ],
    edges: [
      { id: 'e1', from: '1', to: '2' }
    ]
  };
</script>

<NetworkExplorer 
  {data}={sampleData} 
  width="100%" 
  height="600px" 
  title="Network Graph" 
  enableSearch={true}
  enableFilter={true}
/>
```

### Routes
The visualizations are accessible through dedicated routes:
- `/visualization` - Main visualization overview page
- `/visualization/graph` - Graph Visualization
- `/visualization/network` - Network Explorer
- `/visualization/hierarchy-tree` - Hierarchy Tree
- `/visualization/flow` - Concept Flow (Sankey)
- `/visualization/ontology` - Ontology Map
- `/visualization/radial` - Radial Tree
- `/visualization/matrix` - Matrix View
- `/visualization/3d` - 3D Visualization

## API Reference

### Data Structures

#### Node
```typescript
type Node = {
  id: string;
  label: string;
  title?: string;
  color?: string;
  x?: number;
  y?: number;
  type?: 'concept' | 'entity' | 'relation' | 'attribute';
  [key: string]: any;
};
```

#### Edge
```typescript
type Edge = {
  id: string;
  from: string;
  to: string;
  label?: string;
  title?: string;
  color?: string;
  value?: number;
  [key: string]: any;
};
```

#### Graph Data
```typescript
type GraphData = {
  nodes: Node[];
  edges: Edge[];
};
```

## Navigation Integration

A "Visualization" link has been added to the main navigation header, making all visualization tools easily accessible from any page in the application. This link appears in the main navigation alongside other top-level sections like "Concepts", "Languages", and "Dictionaries".

## Features

### Interactive Elements
- **Zoom and Pan:** All visualization components support zooming and panning for better exploration
- **Tooltips:** Hover over nodes/elements to see additional information
- **Search and Filter:** NetworkExplorer includes search and type filtering
- **Context Menus:** Right-click on nodes in NetworkExplorer for context-specific actions
- **Drag and Drop:** Some components support dragging nodes for better arrangement

### Export Capabilities
- **SVG Export:** Export visualizations as SVG files
- **PNG Export:** Export visualizations as PNG files
- **Universal Export Utility:** Shared export functions across components

### Visualization Types
- **Force-Directed Graphs:** Show relationships with physics-based positioning
- **Sankey Diagrams:** Visualize flows and transfers between concepts
- **Hierarchical Trees:** Display parent-child relationships
- **Network Graphs:** Interactive web of connected elements
- **3D Visualization:** Three-dimensional representations
- **Radial Trees:** Circular hierarchical layouts
- **Matrix Views:** Relationship matrices between concepts

## Dependencies

The visualization system uses the following libraries:

- `d3`: Core library for data visualization
- `d3-sankey`: Sankey diagram implementation
- `vis-network`: Interactive network visualization
- `three`: 3D graphics library
- `@types/three`: TypeScript definitions for Three.js (dev dependency)

## Development Notes

### SSR Safety
The 3D visualization component uses dynamic imports to ensure Server-Side Rendering compatibility, as Three.js can only run in browser environments.

### Performance
- Components are designed with performance in mind
- Proper cleanup functions in onDestory hooks
- Efficient rendering with D3 and Vis-network
- Memory management for large graph datasets

### Extensibility
The modular design allows for easy addition of new visualization types. Components follow the same patterns and can be imported from the visualization index file.

## Testing

### Manual Testing
Each visualization component has been manually tested for:
- Proper rendering with sample data
- Interactive functionality
- Responsive behavior
- Export functionality
- Navigation integration

### Browser Compatibility
All components use modern web standards and have been tested in major browsers.

## Future Enhancements

Potential areas for future development:
- Animation of transitions between states
- More export formats
- Advanced filtering options
- Sharing capabilities
- Performance optimization for large datasets
- Additional visualization types (e.g. chord diagrams, treemaps)

## Troubleshooting

### Common Issues
1. **3D Visualization not loading in SSR environment**: This is expected behavior. The component only loads in browser environments.
2. **SVG export not preserving styles**: For complex styles, external CSS might not be included in exported SVGs.
3. **Large datasets performance**: For very large datasets, consider implementing data pagination or clustering.

### Known Limitations
- Complex SVGs with external resources may not export properly to PNG
- 3D visualizations may be resource-intensive on lower-end hardware
- Some visualizations may require significant time to render large datasets

---

This documentation was generated on 26 October 2025.