<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import HeroPreview from './HeroPreview.svelte';

	export let trans: Record<string, string>;
	export let heroVersion = 'home-v4';

	const metrics = [
		{
			labelKey: 'ui/home/highlights/ontology',
			labelFallback: 'Ontology concepts',
			value: '11k+',
			detailKey: 'ui/home/highlights/ontologyDesc',
			detailFallback: 'Ready-to-use hierarchical data for demos.'
		},
		{
			labelKey: 'ui/home/highlights/i18n',
			labelFallback: 'Languages supported',
			value: '38',
			detailKey: 'ui/home/highlights/i18nDesc',
			detailFallback: 'Instant switching between interface and content.'
		},
		{
			labelKey: 'ui/home/highlights/nav',
			labelFallback: 'Team adoption',
			value: '5x',
			detailKey: 'ui/home/highlights/navDesc',
			detailFallback: 'Cross-team navigation shipped with less friction.'
		}
	];
</script>

<section class="relative isolate overflow-hidden bg-white py-24 sm:py-28">
	<div class="absolute inset-x-0 top-[-18rem] -z-10 transform-gpu blur-3xl" aria-hidden="true">
		<div
			class="relative left-1/2 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-br from-indigo-200 via-white to-purple-200 opacity-70 sm:w-[72.1875rem]"
			style="
				clip-path: polygon(
					74.8% 44.1%,
					92% 56.4%,
					91.5% 78%,
					67% 95.3%,
					38.9% 87.7%,
					17.2% 74%,
					3.5% 52%,
					9.2% 27.5%,
					27.7% 8.1%,
					51.4% 1.6%,
					74% 12.4%
				);
			"
		></div>
	</div>

	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
			<div>
				<div class="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm">
					<span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
					{t(trans, 'ui/home/announcement/version', 'Live design preview')} • {heroVersion}
				</div>

				<h1 class="mt-8 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
					{t(trans, 'ui/home/title', 'Multilingual content')}
					<span class="block text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text">
						{t(trans, 'ui/home/subtitle', 'Management suite')}
					</span>
				</h1>

				<p class="mt-6 max-w-xl text-lg leading-8 text-slate-600">
					{t(
						trans,
						'ui/home/description.v2',
						'Curate rich ontologies, automate translations, and align research teams inside one lightning-fast workspace.'
					)}
				</p>

				<div class="mt-10 flex flex-wrap items-center gap-4">
					<a
						href="/register"
						class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
					>
						{t(trans, 'ui/home/cta/startTrial', 'Start free trial')}
					</a>

					<a
						href="/login"
						class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
					>
						{t(trans, 'ui/button/signIn', 'Sign in')}
					</a>
				</div>

				<dl class="mt-14 grid gap-6 sm:grid-cols-3">
					{#each metrics as metric}
						<div class="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-[0_18px_60px_-40px_rgba(79,70,229,0.55)] backdrop-blur">
							<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
								{t(trans, metric.labelKey, metric.labelFallback)}
							</dt>
							<dd class="mt-2 text-3xl font-semibold text-slate-900">{metric.value}</dd>
							<p class="mt-3 text-sm text-slate-500">
								{t(trans, metric.detailKey, metric.detailFallback)}
							</p>
						</div>
					{/each}
				</dl>
			</div>

			<div class="relative">
				<HeroPreview />
			</div>
		</div>
	</div>
</section>

