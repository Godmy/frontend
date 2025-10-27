<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import ContextMenu from './ContextMenu.svelte';

  // Define types
  export type Node = {
    id: string;
    label: string;
    title?: string;
    color?: string;
    x?: number;
    y?: number;
    shape?: string;
    type?: string;
    [key: string]: any; // Allow additional properties
  };

  export type Edge = {
    id: string;
    from: string;
    to: string;
    label?: string;
    title?: string;
    color?: string;
    [key: string]: any; // Allow additional properties
  };

  export type NetworkData = {
    nodes: Node[];
    edges: Edge[];
  };

  // Props
  export let data: NetworkData = { nodes: [], edges: [] };
  export let width: string = '100%';
  export let height: string = '600px';
  export let title: string = 'Network Explorer';
  export let options: any = {
    nodes: {
      shape: 'dot',
      size: 16,
      font: {
        face: 'Arial',
        size: 14
      }
    },
    edges: {
      width: 2,
      arrows: {
        to: { enabled: true, scaleFactor: 0.8 }
      },
      smooth: { type: 'continuous' }
    },
    physics: {
      enabled: true,
      stabilization: { iterations: 100 }
    },
    interaction: {
      hover: true,
      tooltipDelay: 300
    }
  };

  // New props for search and filter
  export let enableSearch: boolean = true;
  export let enableFilter: boolean = true;

  // Local variables
  let container: HTMLElement;
  let network: any;
  let originalNodes: Node[] = [];
  let originalEdges: Edge[] = [];
  let searchQuery: string = '';
  let filterType: string = 'all';
  let visNetwork: any;
  
  // Context menu variables
  let contextMenuVisible: boolean = false;
  let contextMenuX: number = 0;
  let contextMenuY: number = 0;
  let contextNodeId: string | null = null;
  let contextNode: Node | null = null;

  onMount(async () => {
    if (!container) return;

    // Dynamically import vis-network
    visNetwork = await import('vis-network');
    const { Network, DataSet } = visNetwork;

    // Store original data
    originalNodes = [...data.nodes];
    originalEdges = [...data.edges];

    // Prepare network data
    const nodes = new DataSet(data.nodes);
    const edges = new DataSet(data.edges);

    const networkData = { nodes, edges };

    // Create network
    network = new Network(container, networkData, options);

    // Add event listeners
    network.on('click', (params) => {
      console.log('Node clicked:', params);
    });

    network.on('doubleClick', (params) => {
      console.log('Node double-clicked:', params);
    });

    network.on('oncontext', (params) => {
      console.log('Node right-clicked:', params);
    });

    network.on('hoverNode', (params) => {
      console.log('Node hovered:', params);
    });

    network.on('blurNode', (params) => {
      console.log('Node unhovered:', params);
    });
    
    // Context menu for nodes
    network.on('oncontext', (params) => {
      params.event.preventDefault();
      
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = originalNodes.find(n => n.id === nodeId);
        
        if (node) {
          contextNodeId = nodeId;
          contextNode = node;
          contextMenuX = params.event.clientX;
          contextMenuY = params.event.clientY;
          contextMenuVisible = true;
        }
      }
    });
  });

  // Update network when data changes
  $: if (network && data) {
    originalNodes = [...data.nodes];
    originalEdges = [...data.edges];
    updateNetwork();
  }

  function updateNetwork() {
    if (!network || !visNetwork) return;

    const { DataSet } = visNetwork;

    // Update nodes
    const newNodes = new DataSet(data.nodes);
    network.setData({ nodes: newNodes, edges: new DataSet(data.edges) });
  }

  // Search functionality
  function handleSearch() {
    if (!network || !searchQuery.trim() || !visNetwork) {
      if (visNetwork) {
        const { DataSet } = visNetwork;
        // Reset to original data
        const nodes = new DataSet(originalNodes);
        const edges = new DataSet(originalEdges);
        network.setData({ nodes, edges });
      }
      return;
    }

    const { DataSet } = visNetwork;
    const query = searchQuery.toLowerCase();

    // Filter nodes based on search query
    const filteredNodes = originalNodes.filter(node =>
      node.label.toLowerCase().includes(query) ||
      (node.title && node.title.toLowerCase().includes(query)) ||
      node.id.toLowerCase().includes(query)
    );

    // Get IDs of filtered nodes
    const filteredNodeIds = filteredNodes.map(node => node.id);

    // Filter edges that connect to filtered nodes
    const filteredEdges = originalEdges.filter(edge =>
      filteredNodeIds.includes(edge.from) && filteredNodeIds.includes(edge.to)
    );

    // Update network with filtered data
    const nodes = new DataSet(filteredNodes);
    const edges = new DataSet(filteredEdges);
    network.setData({ nodes, edges });
  }

  // Filter functionality
  function handleFilter() {
    if (!network || filterType === 'all' || !visNetwork) {
      if (visNetwork) {
        const { DataSet } = visNetwork;
        // Reset to original data
        const nodes = new DataSet(originalNodes);
        const edges = new DataSet(originalEdges);
        network.setData({ nodes, edges });
      }
      return;
    }

    const { DataSet } = visNetwork;

    // Filter nodes based on type
    let filteredNodes = [...originalNodes];

    if (filterType !== 'all') {
      filteredNodes = originalNodes.filter(node =>
        node.type === filterType
      );
    }

    // Get IDs of filtered nodes
    const filteredNodeIds = filteredNodes.map(node => node.id);

    // Filter edges that connect to filtered nodes
    const filteredEdges = originalEdges.filter(edge =>
      filteredNodeIds.includes(edge.from) && filteredNodeIds.includes(edge.to)
    );

    // Update network with filtered data
    const nodes = new DataSet(filteredNodes);
    const edges = new DataSet(filteredEdges);
    network.setData({ nodes, edges });
  }

  // Combined search and filter
  function updateSearchFilter() {
    if (!network || !visNetwork) return;

    const { DataSet } = visNetwork;

    let resultNodes = [...originalNodes];
    let resultEdges = [...originalEdges];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      resultNodes = resultNodes.filter(node =>
        node.label.toLowerCase().includes(query) ||
        (node.title && node.title.toLowerCase().includes(query)) ||
        node.id.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      resultNodes = resultNodes.filter(node =>
        node.type === filterType
      );
    }

    // Get IDs of filtered nodes
    const filteredNodeIds = resultNodes.map(node => node.id);

    // Filter edges that connect to filtered nodes
    resultEdges = resultEdges.filter(edge =>
      filteredNodeIds.includes(edge.from) && filteredNodeIds.includes(edge.to)
    );

    // Update network with filtered data
    const nodes = new DataSet(resultNodes);
    const edges = new DataSet(resultEdges);
    network.setData({ nodes, edges });
  }

  function onSearchInput(event: Event) {
    searchQuery = (event.target as HTMLInputElement).value;
    updateSearchFilter();
  }

  function onFilterChange(event: Event) {
    filterType = (event.target as HTMLSelectElement).value;
    updateSearchFilter();
  }

  // Context menu actions
  function viewNodeDetails(nodeId?: string) {
    console.log('View details for node:', nodeId);
    // In a real app, this would open a modal or navigate to a detail page
  }

  function editNode(nodeId?: string) {
    console.log('Edit node:', nodeId);
    // In a real app, this would open an edit form
  }

  function deleteNode(nodeId?: string) {
    console.log('Delete node:', nodeId);
    // In a real app, this would show a confirmation and delete the node
  }

  // Get context menu items based on the node
  function getMenuItems() {
    return [
      {
        label: 'View Details',
        action: viewNodeDetails,
        icon: '👁️'
      },
      {
        label: 'Edit Node',
        action: editNode,
        icon: '✏️'
      },
      {
        label: 'Delete Node',
        action: deleteNode,
        icon: '🗑️'
      },
      {
        label: 'Filter by Type',
        action: () => {
          if (contextNode?.type) {
            filterType = contextNode.type;
            updateSearchFilter();
          }
        },
        icon: '🔍'
      }
    ];
  }

  onDestroy(() => {
    if (network) {
      network.destroy();
    }
  });
</script>

<style>
  .network-explorer-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .network-explorer-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
  }

  .network-explorer-search {
    flex-grow: 1;
  }

  .network-explorer-title {
    margin-bottom: 10px;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .network-container {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    flex-grow: 1;
  }

  .vis-network {
    width: 100%;
    height: 100%;
  }

  .vis-tooltip {
    position: absolute;
    visibility: hidden;
    padding: 5px;
    white-space: nowrap;
    font-family: verdana;
    font-size: 14px;
    color: #000000;
    background-color: #f5f4ed;
    border: 1px solid #808074;
    border-radius: 3px;
    opacity: 0.8;
  }
</style>

<div class="network-explorer-container">
  <h3 class="network-explorer-title">{title}</h3>
  
  {#if enableSearch || enableFilter}
    <div class="network-explorer-controls">
      {#if enableSearch}
        <div class="network-explorer-search">
          <input
            type="text"
            placeholder="Search nodes..."
            on:input={onSearchInput}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      {/if}
      
      {#if enableFilter}
        <select
          on:change={onFilterChange}
          class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="all">All Types</option>
          <option value="concept">Concept</option>
          <option value="entity">Entity</option>
          <option value="relation">Relation</option>
          <option value="attribute">Attribute</option>
        </select>
      {/if}
    </div>
  {/if}
  
  <div
    bind:this={container}
    class="network-container"
    style="width: {width}; height: {height};"
  />
  
  <ContextMenu
    visible={contextMenuVisible}
    x={contextMenuX}
    y={contextMenuY}
    nodeId={contextNodeId}
    items={getMenuItems()}
    title="Node Actions"
    on:close={() => contextMenuVisible = false}
  />
</div>