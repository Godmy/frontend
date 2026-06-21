<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // Define types
  export type TreeNode = {
    id: string;
    name: string;
    children?: TreeNode[];
    value?: number;
    [key: string]: any; // Allow additional properties
  };

  // Props
  export let data: TreeNode;
  export let width: number = 800;
  export let height: number = 600;
  export let title: string = 'Radial Tree Visualization';
  export let radius: number = 300;

  // Local variables
  let container: HTMLElement;
  let svg: any;
  let g: any;
  let root: any;
  let treeLayout: any;
  let isMounted = false;
  let d3: any;

  onMount(async () => {
    d3 = await import('d3');
    isMounted = true;
    if (data) {
      createRadialTree();
    }
  });

  $: if (isMounted && data) {
    createRadialTree();
  }

  function createRadialTree() {
    if (!container || !data) return;

    // Clear previous visualization
    if (svg) {
      svg.selectAll('*').remove();
    }

    // Create SVG
    svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height].join(','))
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    // Create a group centered in the SVG
    g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create root node from data
    root = d3.hierarchy(data);
    
    // Create radial tree layout
    treeLayout = d3.tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    // Compute the tree layout
    treeLayout(root);

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'radial-tree-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px');

    // Create links between nodes
    const link = g.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(root.links())
      .join('path')
        .attr('d', d3.linkRadial<any>()
          .angle(d => d.x)
          .radius(d => d.y));

    // Create nodes
    const node = g.append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll('g')
      .data(root.descendants())
      .join('g')
        .attr('transform', d => `
          rotate(${d.x * 180 / Math.PI - 90})
          translate(${d.y},0)
        `);

    node.append('circle')
      .attr('fill', d => d.children ? '#4682b4' : '#e34f26')
      .attr('r', 4)
      .on('mouseover', (event, d) => {
        tooltip
          .text(d.data.name || d.data.id)
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

    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.x < Math.PI ? 6 : -6)
      .attr('text-anchor', d => d.x < Math.PI ? 'start' : 'end')
      .attr('transform', d => d.x >= Math.PI ? 'rotate(180)' : null)
      .text(d => d.data.name || d.data.id)
      .style('fill-opacity', 1)
      .style('font-size', '10px')
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        tooltip
          .text(d.data.name || d.data.id)
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
  .radial-tree-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .radial-tree-title {
    margin-bottom: 10px;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .radial-tree-visualization-container {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    flex-grow: 1;
  }

  .radial-tree-tooltip {
    pointer-events: none;
    z-index: 1000;
  }

  circle {
    cursor: pointer;
  }

  text {
    cursor: pointer;
  }

  svg {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: visible;
  }
</style>

<div class="radial-tree-container">
  <h3 class="radial-tree-title">{title}</h3>
  <div bind:this={container} class="radial-tree-visualization-container" />
</div>