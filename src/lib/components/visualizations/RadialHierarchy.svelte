<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let svgElement: SVGElement;
  const width = 800;
  const height = 800;
  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = Math.min(width, height) / 2 - 60;

  // Sample hierarchical data
  const data = {
    name: "Root",
    children: [
      { name: "Branch 1", children: [{ name: "Leaf A" }, { name: "Leaf B" }] },
      { name: "Branch 2", children: [{ name: "Leaf C" }, { name: "Leaf D" }, { name: "Leaf E" }] },
      { name: "Branch 3", children: [{ name: "Leaf F" }] },
    ]
  };

  onMount(() => {
    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-cx, -cy, width, height])
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    const tree = d3.tree().size([2 * Math.PI, radius]).separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
    const root = tree(d3.hierarchy(data));

    // Links
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
        .attr("d", d3.linkRadial()
            .angle((d: any) => d.x)
            .radius((d: any) => d.y) as any);

    // Nodes
    svg.append("g")
      .selectAll()
      .data(root.descendants())
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
      .data(root.descendants())
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
        .text((d: any) => d.data.name);
  });
</script>

<div class="radial-hierarchy-container">
  <svg bind:this={svgElement}></svg>
</div>

<style>
  .radial-hierarchy-container {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: #f9fafb;
  }
</style>
