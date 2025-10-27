<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let svgElement: SVGElement;

  // Sample data
  const nodes = [
    { name: 'A' }, { name: 'B' }, { name: 'C' },
    { name: 'D' }, { name: 'E' }, { name: 'F' },
    { name: 'G' }, { name: 'H' }
  ];
  const links = [
    { source: 0, target: 1 }, { source: 0, target: 2 },
    { source: 1, target: 3 }, { source: 2, target: 4 },
    { source: 3, target: 4 }, { source: 3, target: 5 },
    { source: 4, target: 6 }, { source: 5, target: 7 },
    { source: 6, target: 7 },
  ];

  onMount(() => {
    const margin = { top: 80, right: 0, bottom: 10, left: 80 };
    const width = 600;
    const height = 600;

    const svg = d3.select(svgElement)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, width]).domain(d3.range(nodes.length) as any);
    const y = d3.scaleBand().range([0, height]).domain(d3.range(nodes.length) as any);

    const matrix = nodes.map(() => nodes.map(() => 0));
    links.forEach(link => {
      matrix[link.source][link.target] = 1;
      matrix[link.target][link.source] = 1; // For undirected graph
    });

    svg.append('rect')
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f9fafb');

    const rows = svg.selectAll('.row')
      .data(matrix)
      .enter().append('g')
      .attr('class', 'row')
      .attr('transform', (d, i) => `translate(0,${y(i as any)})`);

    const cells = rows.selectAll('.cell')
      .data(d => d)
      .enter().append('rect')
      .attr('class', 'cell')
      .attr('x', (d, i) => x(i as any) || 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill-opacity', d => d ? 1 : 0.2)
      .style('fill', d => d ? '#3182ce' : '#e2e8f0');

    const rowLabels = svg.selectAll('.row-label')
      .data(nodes)
      .enter().append('text')
      .attr('class', 'row-label')
      .attr('x', -5)
      .attr('y', (d, i) => (y(i as any) || 0) + y.bandwidth() / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .text(d => d.name);

    const colLabels = svg.selectAll('.col-label')
      .data(nodes)
      .enter().append('text')
      .attr('class', 'col-label')
      .attr('x', (d, i) => (x(i as any) || 0) + x.bandwidth() / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .text(d => d.name);
  });
</script>

<div class="adjacency-matrix-container">
  <svg bind:this={svgElement}></svg>
</div>

<style>
  .adjacency-matrix-container {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: auto;
  }
</style>
