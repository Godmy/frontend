<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // Define types
  export type Node = {
    id: string;
    label: string;
    title?: string;
    color?: string;
    type?: 'concept' | 'entity' | 'relation' | 'attribute';
    x?: number;
    y?: number;
    value?: number;
    [key: string]: any; // Allow additional properties
  };

  export type Edge = {
    id: string;
    from: string;
    to: string;
    label?: string;
    title?: string;
    color?: string;
    value?: number;
    [key: string]: any; // Allow additional properties
  };

  export type GraphData = {
    nodes: Node[];
    edges: Edge[];
  };

  // Props
  export let data: GraphData = { nodes: [], edges: [] };
  export let width: number = 800;
  export let height: number = 600;
  export let title: string = 'Graph Visualization';
  export let visualizationType: 'force' | 'sankey' | 'network' = 'force';
  export let options: any = {};

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
    console.log('GraphVisualization mounted', { hasData: !!data, dataNodes: data?.nodes?.length, container: !!container });

    // Dynamically import libraries
    [d3, d3Sankey, visNetwork] = await Promise.all([
      import('d3'),
      import('d3-sankey'),
      import('vis-network')
    ]);

    isMounted = true;
    if (data) {
      createVisualization();
    }
  });

  $: if (isMounted && data && visualizationType) {
    console.log('Reactive update', { nodes: data.nodes.length, type: visualizationType });
    createVisualization();
  }

  function createVisualization() {
    if (!container || !data) {
      console.log('Cannot create visualization', { container: !!container, data: !!data });
      return;
    }
    console.log('Creating visualization', { type: visualizationType, nodes: data.nodes.length });

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
    } else if (visualizationType === 'network') {
      createVisNetwork();
    }
  }

  function createForceGraph() {
    if (!container) return;

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

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'graph-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px');

    // Create simulation
    simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
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
      .attr('fill', d => visColors[d.type] || '#4682b4')
      .call(drag(simulation))
      .on('mouseover', (event, d) => {
        tooltip
          .text(`${d.label || d.id}`)
          .style('visibility', 'visible');
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
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
    if (!container || data.nodes.length === 0 || data.edges.length === 0) return;

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

    // Prepare data for sankey
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

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'sankey-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px');

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
      .attr('id', (d: any) => `link-${d.index}`)
      .on('mouseover', (event, d: any) => {
        tooltip
          .text(`Flow: ${data.nodes[d.source.index].label || data.nodes[d.source.index].id} → ${data.nodes[d.target.index].label || data.nodes[d.target.index].id}: ${d.value}`)
          .style('visibility', 'visible');
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

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
      .attr('id', (d: any) => data.nodes[d.index].id)
      .on('mouseover', (event, d: any) => {
        tooltip
          .text(`${data.nodes[d.index].label || data.nodes[d.index].id}: ${d.value || 0}`)
          .style('visibility', 'visible');
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    // Add labels to sankey nodes
    svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', (d: any) => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => d.x0 < width / 2 ? 'start' : 'end')
      .text((d: any) => d.label || d.id);
  }

  function createVisNetwork() {
    if (!container || !visNetwork) return;

    const { DataSet, Network } = visNetwork;

    // Prepare network data
    const visNodes = new DataSet(
      data.nodes.map(node => ({
        id: node.id,
        label: node.label,
        title: node.title,
        color: node.color || visColors[node.type] || '#4682b4',
        ...node
      }))
    );

    const visEdges = new DataSet(
      data.edges.map(edge => ({
        id: edge.id,
        from: edge.from,
        to: edge.to,
        label: edge.label,
        title: edge.title,
        color: edge.color,
        value: edge.value,
        ...edge
      }))
    );

    const networkData = { nodes: visNodes, edges: visEdges };

    // Default options for Vis Network
    const defaultOptions = {
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
      },
      ...options
    };

    // Create network
    network = new Network(container, networkData, defaultOptions);

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
  }

  function drag(simulation: any) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
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
  .graph-visualization-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .graph-visualization-title {
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

  .graph-tooltip {
    pointer-events: none;
    z-index: 1000;
  }
</style>

<div class="graph-visualization-container">
  <h3 class="graph-visualization-title">{title} - {visualizationType} View</h3>
  <div bind:this={container} class="visualization-container" style="width: {width}px; height: {height}px;" />
</div>