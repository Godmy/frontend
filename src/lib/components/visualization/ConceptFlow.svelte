<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // Define types
  export type Node = {
    id: string;
    name: string;
    value?: number;
  };

  export type Link = {
    source: string;
    target: string;
    value: number;
  };

  export type SankeyData = {
    nodes: Node[];
    links: Link[];
  };

  // Props
  export let data: SankeyData = { nodes: [], links: [] };
  export let width: number = 800;
  export let height: number = 600;
  export let title: string = 'Concept Flow';

  // Local variables
  let container: HTMLElement;
  let svg: any;
  let tooltip: any;
  let d3: any;
  let d3Sankey: any;

  onMount(async () => {
    // Dynamically import libraries
    [d3, d3Sankey] = await Promise.all([
      import('d3'),
      import('d3-sankey')
    ]);

    // Create SVG
    svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height].join(','))
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    // Create tooltip
    tooltip = d3.select('body')
      .append('div')
      .attr('class', 'sankey-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px');

    // Draw the sankey diagram
    drawSankey();
  });

  // Redraw when data changes
  $: if (svg && data) {
    drawSankey();
  }

  function drawSankey() {
    if (!data || data.nodes.length === 0 || data.links.length === 0) return;

    // Clear previous diagram
    svg.selectAll('*').remove();

    // Create the sankey generator
    const sankey = d3Sankey.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);

    // Compute the Sankey layout
    const { nodes, links } = sankey({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d }))
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
      .attr('fill', (d: any) => {
        // Color based on node group or concept type if available
        return d.color || '#4682b4';
      })
      .attr('id', (d: any) => d.id)
      .on('mouseover', (event, d: any) => {
        tooltip
          .text(`${d.name}: ${d.value || 0}`)
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

    // Add links
    const link = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.5)
      .selectAll('g')
      .data(links)
      .join('g');

    link.append('path')
      .attr('d', d3Sankey.sankeyLinkHorizontal())
      .attr('stroke', (d: any) => d.color || '#000')
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('id', (d: any) => `link-${d.index}`)
      .on('mouseover', (event, d: any) => {
        tooltip
          .text(`Flow: ${d.source.name} → ${d.target.name}: ${d.value}`)
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

    // Add labels
    const label = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .attr('text-anchor', 'end')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', (d: any) => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => d.x0 < width / 2 ? 'start' : 'end')
      .text((d: any) => d.name);
  }

  onDestroy(() => {
    // Cleanup: remove tooltip when component is destroyed
    if (tooltip) {
      tooltip.remove();
    }
    
    if (svg) {
      svg.remove();
    }
  });
</script>

<style>
  .sankey-tooltip {
    pointer-events: none;
    z-index: 1000;
  }

  svg {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: visible;
  }

  rect {
    cursor: pointer;
  }

  rect:hover {
    opacity: 0.8;
  }
</style>

<div class="concept-flow-container">
  <h3>{title}</h3>
  <div bind:this={container} class="sankey-diagram" />
</div>