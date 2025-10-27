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
  export let title: string = 'Hierarchy Tree';
  export let collapsible: boolean = true;

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
      createTree();
    }
  });

  $: if (isMounted && data) {
    createTree();
  }

  function createTree() {
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

    g = svg.append('g');

    // Create root node from data
    root = d3.hierarchy(data);
    root.dx = 20;
    root.dy = width / (root.height + 1);

    // Create tree layout
    treeLayout = d3.tree()
      .size([height, width - 160])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1) / a.depth);

    // Compute the tree layout
    treeLayout(root);

    // Update node positions
    let i = 0;
    const duration = 750;
    const node: d3.Selection<SVGGElement, HierarchyNode<any>, SVGGElement, any> = g
      .selectAll('g')
      .data(root.descendants())
      .join(
        enter => {
          const nodeEnter = enter.append('g')
            .attr('transform', d => `translate(${d.y},${d.x})`)
            .attr('class', 'node');

          // Add circles for nodes
          nodeEnter.append('circle')
            .attr('r', 5)
            .attr('fill', d => d.children ? '#4682b4' : '#e34f26')
            .on('click', (event, d) => {
              if (collapsible) {
                clickHandler(d);
              }
            });

          // Add labels for nodes
          nodeEnter.append('text')
            .attr('dy', '0.31em')
            .attr('x', d => d.children || d._children ? -10 : 10)
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .text(d => d.data.name)
            .style('fill-opacity', 1)
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
              if (collapsible) {
                clickHandler(d);
              }
            });

          return nodeEnter;
        },
        update => update
          .attr('transform', d => `translate(${d.y},${d.x})`),
        exit => exit.remove()
      );

    // Create links between nodes
    const link: d3.Selection<SVGPathElement, HierarchyNode<any>, SVGGElement, any> = g
      .selectAll('path')
      .data(root.links())
      .join(
        enter => {
          return enter.append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
              .x(d => d.y)
              .y(d => d.x))
            .attr('fill', 'none')
            .attr('stroke', '#ccc')
            .attr('stroke-width', 1);
        },
        update => update
          .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x)),
        exit => exit.remove()
      );
  }

  function clickHandler(d: HierarchyNode<any>) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    
    createTree();
  }

  onDestroy(() => {
    isMounted = false;
    if (svg) {
      svg.remove();
    }
  });
</script>

<style>
  .hierarchy-tree-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .hierarchy-tree-title {
    margin-bottom: 10px;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .tree-container {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    flex-grow: 1;
  }

  circle {
    cursor: pointer;
    stroke: #333;
    stroke-width: 1px;
  }

  text {
    font-size: 12px;
    cursor: pointer;
  }

  .link {
    fill: none;
    stroke: #9ecae1;
    stroke-width: 1.5px;
  }

  svg {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: visible;
  }
</style>

<div class="hierarchy-tree-container">
  <h3 class="hierarchy-tree-title">{title}</h3>
  <div bind:this={container} class="tree-container" />
</div>