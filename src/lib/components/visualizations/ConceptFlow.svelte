<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

  let svgElement: SVGElement;

  // Sample data for the Sankey diagram
  const data = {
    nodes: [ { name: 'Source A' },
      { name: 'Source B' },
      { name: 'Process 1' },
      { name: 'Process 2' },
      { name: 'Output X' },
      { name: 'Output Y' }
    ],
    links: [
      { source: 0, target: 2, value: 10 },
      { source: 0, target: 3, value: 2 },
      { source: 1, target: 2, value: 3 },
      { source: 1, target: 3, value: 9 },
      { source: 2, target: 4, value: 9 },
      { source: 2, target: 5, value: 4 },
      { source: 3, target: 4, value: 11 }
    ]
  };

  onMount(() => {
    const width = 800;
    const height = 400;

    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');

    const sankeyLayout = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);

    const { nodes, links } = sankeyLayout(data);

    // Draw links
    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.2)
      .selectAll('path')
      .data(links)
      .join('path')
        .attr('d', sankeyLinkHorizontal())
        .attr('stroke-width', d => Math.max(1, d.width || 0));

    // Draw nodes
    svg.append('g')
      .attr('stroke', '#000')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
        .attr('x', d => d.x0 || 0)
        .attr('y', d => d.y0 || 0)
        .attr('height', d => (d.y1 || 0) - (d.y0 || 0))
        .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
        .attr('fill', '#a0aec0')
      .append('title')
        .text(d => `${d.name}\n${d.value}`);

    // Add labels
    svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('text')
      .data(nodes)
      .join('text')
        .attr('x', d => (d.x0 || 0) < width / 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6)
        .attr('y', d => ((d.y1 || 0) + (d.y0 || 0)) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', d => (d.x0 || 0) < width / 2 ? 'start' : 'end')
        .text(d => d.name);
  });
</script>

<div class="sankey-container">
  <svg bind:this={svgElement}></svg>
</div>

<style>
  .sankey-container {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
  }
</style>
