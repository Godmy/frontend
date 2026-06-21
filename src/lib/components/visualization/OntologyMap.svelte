<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // Define types
  export type Node = {
    id: string;
    label: string;
    title?: string;
    color?: string;
    type: 'concept' | 'entity' | 'relation' | 'attribute';
    x?: number;
    y?: number;
    value?: number;
  };

  export type Edge = {
    id: string;
    from: string;
    to: string;
    label?: string;
    title?: string;
    color?: string;
    value?: number;
  };

  export type OntologyData = {
    nodes: Node[];
    edges: Edge[];
  };

  // Props
  export let data: OntologyData = { nodes: [], edges: [] };
  export let width: number = 800;
  export let height: number = 600;
  export let title: string = 'Ontology Map';
  export let visualizationType: 'force' | 'sankey' | 'hierarchy' = 'force';

  // Local variables
  let container: HTMLElement;
  let svg: any;
  let network: any;
  let simulation: any;
  let isMounted = false;
  let d3: any;
  let d3Sankey: any;
  let visNetwork: any;

  const visColors = {
    concept: '#4682b4',
    entity: '#32cd32',
    relation: '#ff6347',
    attribute: '#9370db'
  };

  onMount(async () => {
    // Dynamically import libraries
    [d3, d3Sankey, visNetwork] = await Promise.all([
      import('d3'),
      import('d3-sankey'),
      import('vis-network')
    ]);

    isMounted = true;

    if (visualizationType === 'force') {
      createForceGraph();
    } else if (visualizationType === 'sankey') {
      createSankeyDiagram();
    } else if (visualizationType === 'hierarchy') {
      // For hierarchy, we could implement a tree layout
      createForceGraph(); // Using force layout as a placeholder for now
    }
  });

  // Redraw when data or visualization type changes
  $: if (isMounted && data && visualizationType) {
    redrawVisualization();
  }

  function redrawVisualization() {
    if (!data) return;

    // Clear previous visualization
    if (svg) {
      svg.selectAll('*').remove();
    }
    
    if (network) {
      network.destroy();
    }

    if (visualizationType === 'force') {
      createForceGraph();
    } else if (visualizationType === 'sankey') {
      createSankeyDiagram();
    } else if (visualizationType === 'hierarchy') {
      createForceGraph(); // Using force layout as a placeholder for now
      // TODO: Implement actual hierarchy visualization
    }
  }

  function createForceGraph() {
    if (!container || !d3) return;

    // Create SVG
    svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height].join(','))
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    // Create a group for zooming
    const g = svg.append('g');

    // Create nodes and links for simulation
    const nodes = data.nodes.map(node => ({
      ...node,
      x: Math.random() * width,
      y: Math.random() * height
    }));
    
    const links = data.edges.map(edge => ({
      source: edge.from,
      target: edge.to,
      value: edge.value || 1
    }));

    // Create simulation
    simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Add links to the graph
    const link = g.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d: any) => Math.sqrt(d.value));

    // Add nodes to the graph
    const node = g.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 10)
      .attr('fill', d => visColors[(d as any).type] || '#4682b4')
      .call(drag(simulation))
      .on('mouseover', (event, d) => {
        // Show tooltip or highlight
        console.log('Node hovered:', d);
      });

    // Add labels to nodes
    const label = g.append('g')
      .attr('class', 'labels')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.label)
      .attr('dy', '20px')
      .attr('x', d => d.x)
      .attr('y', d => d.y);

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
  }

  function createSankeyDiagram() {
    if (!container || data.nodes.length === 0 || data.edges.length === 0 || !d3 || !d3Sankey) return;

    // Create SVG
    svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height].join(','))
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    // Create the sankey generator
    const sankey = d3Sankey.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);

    // Prepare data for sankey (simplified for now)
    const sankeyNodes = data.nodes.map((node, index) => ({
      ...node,
      index
    }));
    
    const sankeyLinks = data.edges.map((edge, index) => {
      const sourceIndex = data.nodes.findIndex(n => n.id === edge.from);
      const targetIndex = data.nodes.findIndex(n => n.id === edge.to);
      return {
        ...edge,
        source: sourceIndex,
        target: targetIndex,
        value: edge.value || 1,
        index
      };
    });

    // Compute the Sankey layout
    const { nodes, links } = sankey({
      nodes: sankeyNodes,
      links: sankeyLinks
    });

    // Add links
    const link = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.5)
      .selectAll('g')
      .data(links)
      .join('g');

    link.append('path')
      .attr('d', d3Sankey.sankeyLinkHorizontal())
      .attr('stroke', (d: any) => visColors[data.nodes[d.source.index].type] || '#000')
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('id', (d: any) => `link-${d.index}`);

    // Add nodes
    const node = svg.append('g')
      .attr('stroke', '#000')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => visColors[data.nodes[d.index].type] || '#4682b4')
      .attr('id', (d: any) => data.nodes[d.index].id);
  }

  function drag(simulation: d3.Simulation<any, any>) {
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, any, any>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, any, any>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, any, any>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  onDestroy(() => {
    isMounted = false;
    if (simulation) {
      simulation.stop();
    }
    if (network) {
      network.destroy();
    }
    if (svg) {
      svg.remove();
    }
  });
</script>

<style>
  .ontology-map-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .ontology-map-title {
    margin-bottom: 10px;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .visualization-container {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    flex-grow: 1;
  }

  circle {
    cursor: pointer;
  }

  circle:hover {
    opacity: 0.8;
  }

  svg {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: visible;
  }
</style>

<div class="ontology-map-container">
  <h3 class="ontology-map-title">{title} - {visualizationType} View</h3>
  <div bind:this={container} class="visualization-container" />
</div>