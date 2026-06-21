<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // Define types
  export type MatrixData = {
    nodes: string[];
    matrix: number[][];
  };

  // Props
  export let data: MatrixData = { nodes: [], matrix: [] };
  export let width: number = 800;
  export let height: number = 600;
  export let title: string = 'Matrix Visualization';
  export let cellSize: number = 20;

  // Local variables
  let container: HTMLElement;
  let svg: any;
  let isMounted = false;
  let d3: any;

  onMount(async () => {
    d3 = await import('d3');
    isMounted = true;
    if (data && data.nodes.length > 0 && data.matrix.length > 0) {
      createMatrix();
    }
  });

  $: if (isMounted && data && data.nodes.length > 0 && data.matrix.length > 0) {
    createMatrix();
  }

  function createMatrix() {
    if (!container || !data || data.nodes.length === 0 || data.matrix.length === 0) return;

    // Calculate dimensions
    const n = data.nodes.length;
    const fullWidth = n * cellSize + 100;  // Extra space for labels
    const fullHeight = n * cellSize + 100; // Extra space for labels

    // Clear previous visualization
    if (svg) {
      svg.selectAll('*').remove();
    }

    // Create SVG
    svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, fullWidth, fullHeight].join(','))
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    // Create a group for the visualization
    const g = svg.append('g').attr('transform', 'translate(50,50)');

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'matrix-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px');

    // Scale for color intensity
    const maxValue = d3.max(data.matrix.flat()) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxValue]);

    // Create matrix cells
    const row = g.selectAll('.row')
      .data(data.matrix)
      .enter().append('g')
      .attr('class', 'row')
      .attr('transform', (d, i) => `translate(0,${i * cellSize})`);

    const cell = row.selectAll('.cell')
      .data((d, i) => d.map((cellValue, j) => ({ row: i, col: j, value: cellValue })))
      .enter().append('rect')
      .attr('class', 'cell')
      .attr('x', (d) => d.col * cellSize)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .style('fill', (d) => colorScale(d.value))
      .on('mouseover', (event, d) => {
        tooltip
          .html(`
            <div><strong>${data.nodes[d.row]}</strong> → <strong>${data.nodes[d.col]}</strong></div>
            <div>Value: ${d.value}</div>
          `)
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

    // Add row labels
    const rowLabels = g.append('g')
      .attr('class', 'row-labels')
      .selectAll('text')
      .data(data.nodes)
      .enter().append('text')
      .attr('x', -6)
      .attr('y', (d, i) => i * cellSize + cellSize / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .text(d => d)
      .style('font-size', '10px');

    // Add column labels
    const colLabels = g.append('g')
      .attr('class', 'column-labels')
      .selectAll('text')
      .data(data.nodes)
      .enter().append('text')
      .attr('x', (d, i) => i * cellSize + cellSize / 2)
      .attr('y', -6)
      .attr('text-anchor', 'middle')
      .text(d => d)
      .style('font-size', '10px');

    // Add diagonal labels if there are many nodes
    if (data.nodes.length <= 20) {
      const diagonalLabels = g.selectAll('.diagonal-label')
        .data(data.matrix.map((row, i) => ({ i, value: row[i] })))
        .enter().append('text')
        .attr('class', 'diagonal-label')
        .attr('x', (d) => d.i * cellSize + cellSize / 2)
        .attr('y', (d) => d.i * cellSize + cellSize / 2)
        .attr('dy', '.32em')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '8px')
        .text(d => d.value);
    }

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
  }

  onDestroy(() => {
    isMounted = false;
    if (svg) {
      svg.remove();
    }
  });
</script>

<style>
  .matrix-visualization-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .matrix-visualization-title {
    margin-bottom: 10px;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .matrix-container {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    flex-grow: 1;
  }

  .cell {
    stroke: #fff;
    stroke-width: 1px;
  }

  .matrix-tooltip {
    pointer-events: none;
    z-index: 1000;
  }

  svg {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: visible;
  }
</style>

<div class="matrix-visualization-container">
  <h3 class="matrix-visualization-title">{title}</h3>
  <div bind:this={container} class="matrix-container" />
</div>