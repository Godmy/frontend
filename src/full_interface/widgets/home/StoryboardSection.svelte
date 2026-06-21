<script lang="ts">
	import { t } from '$lib/utils/i18n';

	export let trans: Record<string, string>;

	const steps = [
		{
			titleKey: 'ui/home/storyboard/ingest/title',
			titleFallback: 'Capture & import',
			descriptionKey: 'ui/home/storyboard/ingest/description',
			descriptionFallback: 'Import dictionaries, clinical notes, or ontologies from CSV, FHIR, or custom APIs with schema validation.'
		},
		{
			titleKey: 'ui/home/storyboard/map/title',
			titleFallback: 'Map & enrich',
			descriptionKey: 'ui/home/storyboard/map/description',
			descriptionFallback: 'Link concepts, translate definitions, and align attribute sets with automated quality checks.'
		},
		{
			titleKey: 'ui/home/storyboard/share/title',
			titleFallback: 'Publish everywhere',
			descriptionKey: 'ui/home/storyboard/share/description',
			descriptionFallback: 'Share curated knowledge with product, analytics, and AI teams via GraphQL or REST.'
		}
	];
</script>

<section class="bg-white py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.35em] text-purple-500">
					{t(trans, 'ui/home/storyboard/badge', 'Workflow')}
				</p>
				<h2 class="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
					{t(trans, 'ui/home/storyboard/title', 'A guided path from raw data to insight')}
				</h2>
				<p class="mt-4 text-base text-slate-600">
					{t(
						trans,
						'ui/home/storyboard/description',
						'Ship structured knowledge faster with purposeful tooling around ingestion, enrichment, and publication.'
					)}
				</p>

				<ol class="mt-12 space-y-6">
					{#each steps as step, index}
						<li class="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm">
							<div class="flex items-start gap-4">
								<span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-base font-semibold text-purple-600">
									{index + 1}
								</span>
								<div>
									<h3 class="text-lg font-semibold text-slate-900">
										{t(trans, step.titleKey, step.titleFallback)}
									</h3>
									<p class="mt-2 text-sm text-slate-600">
										{t(trans, step.descriptionKey, step.descriptionFallback)}
									</p>
								</div>
							</div>
						</li>
					{/each}
				</ol>
			</div>

			<div class="relative">
				<div class="absolute inset-0 -translate-y-6 translate-x-6 rounded-[2.5rem] bg-gradient-to-br from-purple-200/80 via-white to-indigo-200/80 blur-3xl"></div>
				<div class="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_20px_120px_-60px_rgba(76,29,149,0.55)]">
					<div class="grid grid-cols-3 border-b border-slate-100 bg-slate-50/80">
						{#each steps as step, index}
							<div class={`px-6 py-5 ${index === 0 ? 'bg-white/90' : 'bg-transparent'}`}>
								<p class="text-xs uppercase tracking-[0.3em] text-slate-400">
									{t(trans, 'ui/home/storyboard/stepLabel', 'Step')} {index + 1}
								</p>
								<p class="mt-2 text-sm font-semibold text-slate-900">
									{t(trans, step.titleKey, step.titleFallback)}
								</p>
							</div>
						{/each}
					</div>

					<div class="grid gap-6 p-8 sm:grid-cols-2">
						<div class="rounded-2xl border border-slate-100 bg-slate-900/95 p-6 text-white">
							<p class="text-xs uppercase tracking-[0.3em] text-indigo-300">
								{t(trans, 'ui/home/storyboard/monitoring', 'Monitoring')}
							</p>
							<h4 class="mt-3 text-lg font-semibold">{t(trans, 'ui/home/storyboard/monitoringTitle', 'Quality gates')}</h4>
							<p class="mt-2 text-xs text-indigo-100">
								{t(trans, 'ui/home/storyboard/monitoringDescription', 'Automated checks on terminology coverage, duplicates, and translation drift.')}
							</p>
						</div>

						<div class="flex flex-col justify-between rounded-2xl border border-slate-100 bg-indigo-50/70 p-6 text-slate-900">
							<div>
								<p class="text-xs uppercase tracking-[0.3em] text-indigo-500">
									{t(trans, 'ui/home/storyboard/insights', 'Insights')}
								</p>
								<h4 class="mt-3 text-lg font-semibold">
									{t(trans, 'ui/home/storyboard/insightsTitle', 'Analytics ready')}
								</h4>
								<p class="mt-2 text-xs text-slate-600">
									{t(trans, 'ui/home/storyboard/insightsDescription', 'Push to BI, APIs, or AI experiences with consistent metadata.')}
								</p>
							</div>
							<div class="mt-6 rounded-xl border border-indigo-200 bg-white/80 p-4 text-xs text-slate-600">
								<p>{t(trans, 'ui/home/storyboard/timeSaved', 'Average time saved per data release:')} <span class="font-semibold text-indigo-600">42%</span></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

