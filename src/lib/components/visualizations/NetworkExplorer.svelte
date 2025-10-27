<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { DataSet, DataView } from 'vis-data/peer';
  import { Network } from 'vis-network/peer';
  import type { Edge, Node, IdType } from 'vis-network/peer';

  let container: HTMLDivElement;
  let network: Network | null = null;
  let searchTerm = '';

  // Sample data
  const allNodes = new DataSet<Node>([
    { id: 1, label: 'Concept A' },
    { id: 2, label: 'Concept B' },
    { id: 3, label: 'Related C' },
    { id: 4, label: 'Concept D' },
    { id: 5, label: 'Related E' }
  ]);

  const allEdges = new DataSet<Edge>([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3 }
  ]);

  // Use a DataView to dynamically filter nodes
  const nodesView = new DataView(allNodes, {
    filter: (node) => {
      if (searchTerm.trim() === '') {
        return true;
      }
      return node.label?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    }
  });

  const data = { nodes: nodesView, edges: allEdges };

  const options = {
    interaction: {
      dragNodes: true,
      dragView: true,
      zoomView: true
    },
    nodes: {
        shape: "box",
        size: 16,
        font: {
            size: 14,
            color: "#333"
        },
        borderWidth: 2,
    },
    edges: {
        width: 2,
        arrows: {
            to: { enabled: true, scaleFactor: 1 }
        }
    }
  };

  onMount(() => {
    if (container) {
      network = new Network(container, data, options);

      // Context menu event
      network.on('oncontext', (params) => {
        params.event.preventDefault();
        const nodeId = network?.getNodeAt(params.pointer.DOM);
        if (nodeId) {
          alert(`Context menu for node: ${nodeId}`);
          // In a real app, you would render a custom context menu here
        }
      });
    }
  });

  // Reactive statement to refresh the view when searchTerm changes
  $: {
    if (searchTerm !== undefined) {
        nodesView.refresh();
    }
  }
</script>

<div class="controls mb-4">
  <input
    type="text"
    bind:value={searchTerm}
    placeholder="Search nodes..."
    class="px-3 py-2 border border-gray-300 rounded-md w-full"
  />
</div>

<div bind:this={container} class="network-container" style="height: 500px; width: 100%; border: 1px solid lightgray;"></div>

<style>
  .network-container {
    background-color: #f7f7f7;
  }
  .controls {
    padding: 0 1rem;
  }
</style>
