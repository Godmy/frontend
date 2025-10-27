<script lang="ts">
  import { GraphVisualization } from '$lib/components/visualization';
  import type { GraphData } from '$lib/components/visualization/GraphVisualization.svelte';

  let graphRef: any;
  let currentVisualizationType: 'force' | 'sankey' | 'network' = 'force';
  let enableTooltips = true;
  let enableZoom = true;
  let eventLog: string[] = [];

  // Sample data for demonstration
  let sampleData: GraphData = {
    nodes: [
      { id: '1', label: 'Root Concept', type: 'concept', title: 'Main concept node' },
      { id: '2', label: 'Child A', type: 'entity', title: 'Entity A' },
      { id: '3', label: 'Child B', type: 'entity', title: 'Entity B' },
      { id: '4', label: 'Sub A1', type: 'relation', title: 'Relation A1' },
      { id: '5', label: 'Sub A2', type: 'relation', title: 'Relation A2' },
      { id: '6', label: 'Sub B1', type: 'attribute', title: 'Attribute B1' },
      { id: '7', label: 'Sub B2', type: 'attribute', title: 'Attribute B2' },
      { id: '8', label: 'Leaf 1', type: 'concept', title: 'Leaf concept 1' },
      { id: '9', label: 'Leaf 2', type: 'concept', title: 'Leaf concept 2' },
    ],
    edges: [
      { id: 'e1', from: '1', to: '2', value: 3, label: 'has child' },
      { id: 'e2', from: '1', to: '3', value: 2, label: 'has child' },
      { id: 'e3', from: '2', to: '4', value: 1, label: 'relates to' },
      { id: 'e4', from: '2', to: '5', value: 1, label: 'relates to' },
      { id: 'e5', from: '3', to: '6', value: 1, label: 'has attribute' },
      { id: 'e6', from: '3', to: '7', value: 1, label: 'has attribute' },
      { id: 'e7', from: '4', to: '8', value: 1, label: 'leads to' },
      { id: 'e8', from: '5', to: '9', value: 1, label: 'leads to' },
    ],
  };

  // Large dataset generator for performance testing
  function generateLargeDataset(nodeCount: number): GraphData {
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: `${i}`,
      label: `Node ${i}`,
      type: (['concept', 'entity', 'relation', 'attribute'] as const)[i % 4],
      title: `Tooltip for node ${i}`,
    }));

    const edges = Array.from({ length: Math.min(nodeCount * 2, nodeCount * nodeCount / 10) }, (_, i) => ({
      id: `e${i}`,
      from: `${Math.floor(Math.random() * nodeCount)}`,
      to: `${Math.floor(Math.random() * nodeCount)}`,
      value: Math.floor(Math.random() * 10) + 1,
      label: `Edge ${i}`,
    }));

    return { nodes, edges };
  }

  function loadLargeDataset() {
    sampleData = generateLargeDataset(100);
    addEventLog(`Loaded dataset with ${sampleData.nodes.length} nodes and ${sampleData.edges.length} edges`);
  }

  function loadVeryLargeDataset() {
    sampleData = generateLargeDataset(1000);
    addEventLog(`Loaded large dataset with ${sampleData.nodes.length} nodes and ${sampleData.edges.length} edges`);
  }

  function resetToSampleData() {
    sampleData = {
      nodes: [
        { id: '1', label: 'Root Concept', type: 'concept', title: 'Main concept node' },
        { id: '2', label: 'Child A', type: 'entity', title: 'Entity A' },
        { id: '3', label: 'Child B', type: 'entity', title: 'Entity B' },
        { id: '4', label: 'Sub A1', type: 'relation', title: 'Relation A1' },
        { id: '5', label: 'Sub A2', type: 'relation', title: 'Relation A2' },
        { id: '6', label: 'Sub B1', type: 'attribute', title: 'Attribute B1' },
        { id: '7', label: 'Sub B2', type: 'attribute', title: 'Attribute B2' },
        { id: '8', label: 'Leaf 1', type: 'concept', title: 'Leaf concept 1' },
        { id: '9', label: 'Leaf 2', type: 'concept', title: 'Leaf concept 2' },
      ],
      edges: [
        { id: 'e1', from: '1', to: '2', value: 3, label: 'has child' },
        { id: 'e2', from: '1', to: '3', value: 2, label: 'has child' },
        { id: 'e3', from: '2', to: '4', value: 1, label: 'relates to' },
        { id: 'e4', from: '2', to: '5', value: 1, label: 'relates to' },
        { id: 'e5', from: '3', to: '6', value: 1, label: 'has attribute' },
        { id: 'e6', from: '3', to: '7', value: 1, label: 'has attribute' },
        { id: 'e7', from: '4', to: '8', value: 1, label: 'leads to' },
        { id: 'e8', from: '5', to: '9', value: 1, label: 'leads to' },
      ],
    };
    addEventLog('Reset to sample dataset');
  }

  function handleExportPNG() {
    if (graphRef?.exportToPNG) {
      graphRef.exportToPNG('graph-visualization.png');
      addEventLog('Exported to PNG');
    }
  }

  function handleExportSVG() {
    if (graphRef?.exportToSVG) {
      graphRef.exportToSVG('graph-visualization.svg');
      addEventLog('Exported to SVG');
    }
  }

  function addEventLog(message: string) {
    eventLog = [`[${new Date().toLocaleTimeString()}] ${message}`, ...eventLog].slice(0, 10);
  }

  function handleNodeClick(event: CustomEvent) {
    const { node } = event.detail;
    addEventLog(`Node clicked: ${node.label || node.id}`);
  }

  function handleEdgeClick(event: CustomEvent) {
    const { edge } = event.detail;
    addEventLog(`Edge clicked: ${edge.label || edge.id}`);
  }

  function handleNodeHover(event: CustomEvent) {
    const { node } = event.detail;
    addEventLog(`Node hovered: ${node.label || node.id}`);
  }

  function handleEdgeHover(event: CustomEvent) {
    const { edge } = event.detail;
    addEventLog(`Edge hovered: ${edge.label || edge.id}`);
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Graph Visualization Demo</h1>
    <p class="text-gray-600">
      Interactive graph visualization with support for force-directed, sankey, and network views
    </p>
  </div>

  <!-- Controls -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
    <h2 class="text-xl font-semibold mb-4">Controls</h2>

    <!-- Visualization Type -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Visualization Type</label>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          class="px-4 py-2 rounded-md transition-colors {currentVisualizationType === 'force'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}"
          onclick={() => {
            currentVisualizationType = 'force';
            addEventLog('Switched to force-directed view');
          }}
        >
          Force Directed
        </button>
        <button
          class="px-4 py-2 rounded-md transition-colors {currentVisualizationType === 'sankey'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}"
          onclick={() => {
            currentVisualizationType = 'sankey';
            addEventLog('Switched to sankey diagram');
          }}
        >
          Sankey Diagram
        </button>
        <button
          class="px-4 py-2 rounded-md transition-colors {currentVisualizationType === 'network'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}"
          onclick={() => {
            currentVisualizationType = 'network';
            addEventLog('Switched to network view');
          }}
        >
          Network View
        </button>
      </div>
    </div>

    <!-- Feature Toggles -->
    <div class="mb-4 flex gap-4">
      <label class="flex items-center">
        <input type="checkbox" bind:checked={enableTooltips} class="mr-2" />
        <span class="text-sm font-medium text-gray-700">Enable Tooltips</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" bind:checked={enableZoom} class="mr-2" />
        <span class="text-sm font-medium text-gray-700">Enable Zoom/Pan</span>
      </label>
    </div>

    <!-- Export Buttons -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Export</label>
      <div class="flex gap-4">
        <button
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          onclick={handleExportPNG}
        >
          Export PNG
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onclick={handleExportSVG}
        >
          Export SVG
        </button>
      </div>
    </div>

    <!-- Dataset Controls -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Dataset</label>
      <div class="flex gap-4 flex-wrap">
        <button
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          onclick={resetToSampleData}
        >
          Sample (9 nodes)
        </button>
        <button
          class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          onclick={loadLargeDataset}
        >
          Medium (100 nodes)
        </button>
        <button
          class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          onclick={loadVeryLargeDataset}
        >
          Large (1000 nodes)
        </button>
      </div>
    </div>
  </div>

  <!-- Visualization -->
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
    <GraphVisualization
      bind:this={graphRef}
      data={sampleData}
      visualizationType={currentVisualizationType}
      width="100%"
      height={600}
      title="Interactive Graph Visualization"
      {enableTooltips}
      {enableZoom}
      on:nodeClick={handleNodeClick}
      on:edgeClick={handleEdgeClick}
      on:nodeHover={handleNodeHover}
      on:edgeHover={handleEdgeHover}
    />
  </div>

  <!-- Event Log -->
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <h2 class="text-xl font-semibold mb-4">Event Log</h2>
    <div class="bg-gray-50 rounded-md p-4 font-mono text-sm max-h-60 overflow-y-auto">
      {#if eventLog.length === 0}
        <p class="text-gray-500 italic">No events yet. Interact with the graph to see events.</p>
      {:else}
        {#each eventLog as log}
          <div class="py-1 border-b border-gray-200 last:border-0">{log}</div>
        {/each}
      {/if}
    </div>
  </div>

  <!-- Legend -->
  <div class="bg-white rounded-lg shadow-md p-6 mt-6 border border-gray-200">
    <h2 class="text-xl font-semibold mb-4">Legend</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-full bg-[#4682b4] mr-2"></div>
        <span class="text-sm">Concept</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-full bg-[#32cd32] mr-2"></div>
        <span class="text-sm">Entity</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-full bg-[#ff6347] mr-2"></div>
        <span class="text-sm">Relation</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-full bg-[#9370db] mr-2"></div>
        <span class="text-sm">Attribute</span>
      </div>
    </div>
  </div>
</div>