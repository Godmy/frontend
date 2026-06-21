<script lang="ts">
	import { t } from '$lib/utils/i18n';

	export let trans: Record<string, string>;
</script>

<section class="bg-white py-24">
	<div class="mx-auto max-w-5xl rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-16 shadow-[0_45px_120px_-60px_rgba(15,23,42,0.65)]">
		<div class="mx-auto max-w-3xl text-center text-white">
			<p class="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">
				{t(trans, 'ui/home/cta/badge', 'Get started')}
			</p>
			<h2 class="mt-4 text-3xl font-bold sm:text-4xl">
				{t(trans, 'ui/home/cta/title', 'Ready to get started?')}
			</h2>
			<p class="mt-4 text-base text-indigo-200">
				{t(
					trans,
					'ui/home/cta/description',
					'Join researchers, clinicians, and product teams who orchestrate multilingual knowledge with Humans Ontology.'
				)}
			</p>

			<div class="mt-10 flex flex-wrap justify-center gap-4">
				<a
					href="/register"
					class="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-50"
				>
					{t(trans, 'ui/home/cta/button', 'Create free account')}
				</a>
				<a
					href="/docs"
					class="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
				>
					{t(trans, 'ui/home/cta/docs', 'Explore documentation')}
				</a>
			</div>
		</div>
	</div>
</section>

