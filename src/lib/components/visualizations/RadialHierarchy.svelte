<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  interface ConceptNode {
    id: number;
    path: string;
    depth: number;
    parentId: number | null;
  }

  interface ConceptHierarchy {
    id: number;
    path: string;
    children?: ConceptHierarchy[];
  }

  let svgElement: SVGElement;
  const width = 800;
  const height = 800;
  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = Math.min(width, height) / 2 - 60;

  // Props
  let { concepts = [] as ConceptNode[], isLoading = false } = $props<{
    concepts?: ConceptNode[];
    isLoading?: boolean;
  }>();

  onMount(() => {
    if (!isLoading) {
      createVisualization();
    }
  });

  // Function to transform flat concept list to hierarchical structure
  function buildHierarchy(flatData: ConceptNode[]): ConceptHierarchy[] {
    if (!flatData || flatData.length === 0) return [];
    
    // Create a map of all nodes by id
    const nodeMap = new Map<number, ConceptHierarchy>();
    
    // Create all nodes
    flatData.forEach(item => {
      nodeMap.set(item.id, {
        id: item.id,
        path: item.path,
        children: []
      });
    });

    // Root nodes
    const roots: ConceptHierarchy[] = [];

    // Build the hierarchy
    flatData.forEach(item => {
      const node = nodeMap.get(item.id)!;
      
      if (item.parentId === null) {
        // Root node
        roots.push(node);
      } else {
        // Child node - find parent and add to its children
        const parent = nodeMap.get(item.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        }
      }
    });

    return roots;
  }

  function createVisualization() {
    if (!concepts || concepts.length === 0) return;

    // Clear previous visualization
    d3.select(svgElement).selectAll("*").remove();

    // Build hierarchical structure
    const hierarchyData = buildHierarchy(concepts);
    
    // If we have multiple roots, create a virtual root
    let rootData;
    if (hierarchyData.length === 1) {
      rootData = hierarchyData[0];
    } else {
      rootData = {
        id: 0,
        path: "All Concepts",
        children: hierarchyData
      };
    }

    // Create D3 hierarchy
    const root = d3.hierarchy(rootData, (d: any) => d.children);
    const treeLayout = d3.tree().size([2 * Math.PI, radius]).separation((a, b) => (a.parent === b.parent ? 1 : 2) / (a.depth + 1));
    const treeRoot = treeLayout(root);

    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-cx, -cy, width, height])
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    // Links
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(treeRoot.links())
      .join("path")
        .attr("d", d3.linkRadial()
            .angle((d: any) => d.x)
            .radius((d: any) => d.y) as any);

    // Nodes
    svg.append("g")
      .selectAll()
      .data(treeRoot.descendants())
      .join("circle")
        .attr("transform", (d: any) => `
          rotate(${d.x * 180 / Math.PI - 90})
          translate(${d.y},0)
        `)
        .attr("fill", (d: any) => d.children ? "#555" : "#999")
        .attr("r", 4.5);

    // Labels
    svg.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(treeRoot.descendants())
      .join("text")
        .attr("transform", (d: any) => `
          rotate(${d.x * 180 / Math.PI - 90})
          translate(${d.y},0)
          rotate(${d.x >= Math.PI ? 180 : 0})
        `)
        .attr("dy", "0.31em")
        .attr("x", (d: any) => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", (d: any) => d.x < Math.PI === !d.children ? "start" : "end")
        .attr("paint-order", "stroke")
        .attr("stroke", "white")
        .attr("fill", "currentColor")
        .text((d: any) => d.data.path || d.data.name);
  }

  // Watch for changes in concepts prop
  $effect(() => {
    if (!isLoading && concepts && concepts.length > 0) {
      createVisualization();
    }
  });
</script>

{#if isLoading}
  <div class="loading-container">
    <p>Loading concept hierarchy...</p>
  </div>
{:else}
  <div class="radial-hierarchy-container">
    <svg bind:this={svgElement}></svg>
  </div>
{/if}

<style>
  .radial-hierarchy-container {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: #f9fafb;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 600px;
    width: 100%;
  }
</style>

