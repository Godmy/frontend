<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';
  import { exportSvg, exportPng } from '../../utils/export';

  export let concepts: any[] = [];

  let svgElement: SVGElement;
  const width = 800;
  const height = 600;

  let allData: { nodes: any[], links: any[] } = { nodes: [], links: [] };
  let groups: number[] = [];
  let selectedGroups = new Set<number>();

  let simulation: d3.Simulation<any, any>;
  let link: any;
  let node: any;
  let initialized = false;

  $: {
    if (concepts && concepts.length > 0) {
      const transformed = transformData(concepts);
      allData = transformed;
      groups = Array.from(new Set(allData.nodes.map(n => n.group)));
      selectedGroups = new Set(groups);
      if(initialized) {
        updateSimulation();
      }
    }
  }

  function transformData(concepts: any[]) {
      const nodes = concepts.map(c => ({ id: c.id, group: c.depth, label: c.path }));
      const links = concepts.filter(c => c.parentId !== null).map(c => ({ source: c.parentId, target: c.id }));
      return { nodes, links };
  }

  onMount(() => {
    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');

    simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2));

    link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line');

    node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle');

    if (allData.nodes.length > 0) {
        updateSimulation();
    }
    initialized = true;
  });

  function updateSimulation() {
    if (!simulation) return;

    const filteredNodes = allData.nodes.filter(d => selectedGroups.has(d.group));
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = allData.links.filter(d => 
        typeof d.source === 'object' && d.source !== null && 'id' in d.source &&
        typeof d.target === 'object' && d.target !== null && 'id' in d.target &&
        filteredNodeIds.has(d.source.id) && filteredNodeIds.has(d.target.id)
    );

    simulation.nodes(filteredNodes);
    simulation.force('link').links(filteredLinks);

    node = node.data(filteredNodes, (d: any) => d.id)
      .join(
        enter => enter.append('circle')
          .attr('r', 8)
          .attr('fill', (d: any) => d3.schemeCategory10[d.group % 10])
          .call(drag(simulation))
          .call(node => node.append('title').text((d:any) => d.label)),
        update => update,
        exit => exit.remove()
      );

    link = link.data(filteredLinks, (d: any) => `${d.source.id}-${d.target.id}`)
      .join(
        enter => enter.append('line').attr('stroke-width', 1.5),
        update => update,
        exit => exit.remove()
      );

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });

    simulation.alpha(1).restart();
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
    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  }

  function handleFilterChange(group: number, checked: boolean) {
    if (checked) {
      selectedGroups.add(group);
    } else {
      selectedGroups.delete(group);
    }
    selectedGroups = new Set(selectedGroups); // Trigger reactivity
    updateSimulation();
  }

  function handleExportSvg() {
    exportSvg(svgElement, 'ontology-map');
  }

  function handleExportPng() {
    exportPng(svgElement, 'ontology-map', width, height);
  }
</script>

<div class="ontology-map-container relative">
  <div class="controls-top absolute top-0 left-0 p-2 flex flex-col bg-white bg-opacity-80 rounded-br-lg z-10">
    <h4 class="font-bold text-sm mb-1">Depth</h4>
    {#each groups as group}
      <label class="flex items-center text-sm">
        <input
          type="checkbox"
          checked={selectedGroups.has(group)}
          onchange={(e) => handleFilterChange(group, e.currentTarget.checked)}
          class="mr-1"
        />
        Level {group}
      </label>
    {/each}
  </div>
  <div class="export-buttons absolute top-0 right-0 p-2 z-10">
    <button onclick={handleExportSvg} class="px-3 py-1 border border-gray-300 rounded-md text-sm mr-2 bg-white bg-opacity-80">Export SVG</button>
    <button onclick={handleExportPng} class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white bg-opacity-80">Export PNG</button>
  </div>
  <svg bind:this={svgElement}></svg>
</div>

<style>
  .ontology-map-container {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: #f9fafb;
    position: relative;
  }
</style>
