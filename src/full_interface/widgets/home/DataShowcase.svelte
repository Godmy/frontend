<script lang="ts">
	import { t } from '$lib/utils/i18n';

	export let trans: Record<string, string>;

	const stats = [
		{
			value: '11k – 15k',
			labelKey: 'ui/home/dataShowcase/concepts',
			labelFallback: 'Concepts curated',
			descriptionKey: 'ui/home/dataShowcase/conceptsDesc',
			descriptionFallback: 'Ontology depth that mirrors the body’s physiology.'
		},
		{
			value: '7',
			labelKey: 'ui/home/dataShowcase/categories',
			labelFallback: 'Primary categories',
			descriptionKey: 'ui/home/dataShowcase/categoriesDesc',
			descriptionFallback: 'From systems to micro interactions.'
		},
		{
			value: '10+',
			labelKey: 'ui/home/dataShowcase/levels',
			labelFallback: 'Levels of hierarchy',
			descriptionKey: 'ui/home/dataShowcase/levelsDesc',
			descriptionFallback: 'Navigate relationships with precision.'
		},
		{
			value: '3.2M',
			labelKey: 'ui/home/dataShowcase/relations',
			labelFallback: 'Relationships indexed',
			descriptionKey: 'ui/home/dataShowcase/relationsDesc',
			descriptionFallback: 'Always in sync across languages and regions.'
		}
	];
</script>

<section class="relative isolate overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 py-24">
	<div class="absolute inset-0 opacity-50">
		<div class="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(236,233,254,0.25),transparent_55%),radial-gradient(circle_at_50%_80%,rgba(79,70,229,0.3),transparent_60%)]"></div>
	</div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
		<div class="grid gap-12 lg:grid-cols-[1fr_1fr]">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200">
					{t(trans, 'ui/home/dataShowcase/badge', 'Humans ontology')}
				</p>
				<h2 class="mt-4 text-3xl font-bold sm:text-4xl">
					{t(
						trans,
						'ui/home/dataShowcase/title',
						'Built on a living atlas of human physiology'
					)}
				</h2>
				<p class="mt-4 text-base text-indigo-100">
					{t(
						trans,
						'ui/home/dataShowcase/description',
						'Explore a deeply layered ontology with curated relationships, localisation-ready labels, and versioned history out of the box.'
					)}
				</p>

				<a
					href="/visualization/ontology"
					class="mt-10 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
				>
					{t(trans, 'ui/home/dataShowcase/cta', 'Browse ontology')}
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>

			<div class="grid gap-6 sm:grid-cols-2">
				{#each stats as stat}
					<div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_35px_120px_-60px_rgba(15,23,42,0.6)] backdrop-blur">
						<p class="text-3xl font-semibold text-white">{stat.value}</p>
						<p class="mt-2 text-sm font-semibold uppercase tracking-wide text-indigo-100">
							{t(trans, stat.labelKey, stat.labelFallback)}
						</p>
						<p class="mt-3 text-sm text-indigo-200">
							{t(trans, stat.descriptionKey, stat.descriptionFallback)}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

