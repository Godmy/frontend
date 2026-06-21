<script lang="ts">
	import { t } from '$lib/utils/i18n';

	export let trans: Record<string, string>;

	const partners = [
		{ name: 'NeuroTech Labs', tag: 'Healthcare' },
		{ name: 'BioInsights', tag: 'Research' },
		{ name: 'Multipult Studio', tag: 'Product' },
		{ name: 'DeepLang AI', tag: 'Localization' },
		{ name: 'Atlas Consortium', tag: 'Data' }
	];
</script>

<section class="bg-slate-900 py-16">
	<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
		<p class="text-center text-sm uppercase tracking-[0.4em] text-slate-500">
			{t(trans, 'ui/home/socialProof/title', 'Trusted by research-driven teams')}
		</p>
		<div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
			{#each partners as partner}
				<div class="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 px-5 py-6 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.8)]">
					<span class="text-lg font-semibold text-white">{partner.name}</span>
					<span class="mt-2 text-xs uppercase tracking-wide text-slate-400">{partner.tag}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

