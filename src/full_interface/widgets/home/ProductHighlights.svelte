<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import { BookOpen, Languages as LanguagesIcon, NotebookPen } from 'lucide-svelte';

	export let trans: Record<string, string>;

	const highlights = [
		{
			icon: BookOpen,
			iconBg: 'bg-indigo-100 text-indigo-600',
			titleKey: 'ui/home/feature/concepts/title',
			titleFallback: 'Concept management',
			descriptionKey: 'ui/home/feature/concepts/description',
			descriptionFallback: 'Organise and explore ontologies with deep relationships and instant context.'
		},
		{
			icon: LanguagesIcon,
			iconBg: 'bg-emerald-100 text-emerald-600',
			titleKey: 'ui/home/feature/multilang/title',
			titleFallback: 'Multi-language support',
			descriptionKey: 'ui/home/feature/multilang/description',
			descriptionFallback: 'Handle unlimited locales, approve translations, and ship synchronised updates.'
		},
		{
			icon: NotebookPen,
			iconBg: 'bg-purple-100 text-purple-600',
			titleKey: 'ui/home/feature/workflows/title',
			titleFallback: 'Collaborative workflows',
			descriptionKey: 'ui/home/feature/workflows/description',
			descriptionFallback: 'Align medical, research, and product teams with shared boards and real-time notes.'
		}
	];
</script>

<section class="bg-slate-50 py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<header class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-500">
				{t(trans, 'ui/home/features/badge', 'Why teams choose Humans Ontology')}
			</p>
			<h2 class="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
				{t(trans, 'ui/home/features/title', 'The control centre for your knowledge base')}
			</h2>
			<p class="mt-4 text-base text-slate-600">
				{t(
					trans,
					'ui/home/features/description',
					'From initial capture to publication, every stage is engineered for speed, clarity, and multi-language precision.'
				)}
			</p>
		</header>

		<div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each highlights as highlight}
				<div class="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:shadow-[0_50px_150px_-60px_rgba(79,70,229,0.35)]">
					<div class={`flex h-12 w-12 items-center justify-center rounded-2xl ${highlight.iconBg}`}>
						<svelte:component this={highlight.icon} class="h-5 w-5" />
					</div>
					<h3 class="mt-6 text-xl font-semibold text-slate-900">
						{t(trans, highlight.titleKey, highlight.titleFallback)}
					</h3>
					<p class="mt-3 text-sm leading-6 text-slate-600">
						{t(trans, highlight.descriptionKey, highlight.descriptionFallback)}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

