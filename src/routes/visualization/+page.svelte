<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { t } from '$lib/utils/i18n';

  // Get translations from layout data
  const trans = $derived($page.data.translations || {});

  type VisualizationOption = {
    id: string;
    title: string;
    description: string;
    icon: string;
    route: string;
  };

  let visualizationOptions: VisualizationOption[] = [
    {
      id: 'graph',
      title: 'Graph Visualization',
      description: 'Interactive force-directed graphs showing relationships between concepts',
      icon: '📊',
      route: '/visualization/graph'
    },
    {
      id: 'hierarchy',
      title: 'Hierarchy Tree',
      description: 'Tree visualization for hierarchical concept structures',
      icon: '🌳',
      route: '/visualization/hierarchy-tree'
    },
    {
      id: 'network',
      title: 'Network Explorer',
      description: 'Interactive network graphs with search and filtering',
      icon: '🌐',
      route: '/visualization/network'
    },
    {
      id: 'flow',
      title: 'Concept Flow',
      description: 'Sankey diagrams for showing data flows between concepts',
      icon: '🌊',
      route: '/visualization/flow'
    },
    {
      id: 'ontology',
      title: 'Ontology Map',
      description: 'Comprehensive ontology visualization with multiple view types',
      icon: '🗺️',
      route: '/visualization/ontology'
    },
    {
      id: 'radial',
      title: 'Radial Tree',
      description: 'Radial tree visualization for complex hierarchies',
      icon: '⭕',
      route: '/visualization/radial'
    },
    {
      id: 'matrix',
      title: 'Matrix View',
      description: 'Matrix visualization for showing relationships',
      icon: '⊞',
      route: '/visualization/matrix'
    },
    {
      id: '3d',
      title: '3D Visualization',
      description: 'Three-dimensional visualization of complex structures',
      icon: '立体',
      route: '/visualization/3d'
    }
  ];

  function navigateToVisualization(route: string) {
    goto(route);
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="text-center mb-12">
    <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
      {t(trans, 'ui/visualization/title', 'Ontology Visualizations')}
    </h1>
    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
      {t(trans, 'ui/visualization/description', 'Explore your ontologies through various interactive visualization types')}
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each visualizationOptions as option (option.id)}
      <div 
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
        on:click={() => navigateToVisualization(option.route)}
      >
        <div class="flex items-start">
          <span class="text-3xl mr-4">{option.icon}</span>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 mb-1">
              {t(trans, `ui/visualization/${option.id}/title`, option.title)}
            </h3>
            <p class="text-sm text-gray-600">
              {t(trans, `ui/visualization/${option.id}/description`, option.description)}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <button class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
            {t(trans, 'ui/button/explore', 'Explore →')}
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>