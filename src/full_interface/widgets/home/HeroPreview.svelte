<script lang="ts">
	const timeline = [
		{
			label: 'Ontology',
			value: 'Human physiology',
			tag: 'Live'
		},
		{
			label: 'Language',
			value: 'English / Russian',
			tag: 'Synced'
		},
		{
			label: 'Updated by',
			value: 'Elena K.',
			tag: '2m ago'
		}
	];
	const spotlight = [
		{ title: 'Autonomic system', score: '92%', tone: 'text-indigo-500', background: 'bg-indigo-50' },
		{ title: 'Neural clusters', score: '78%', tone: 'text-emerald-500', background: 'bg-emerald-50' },
		{ title: 'Circulatory flow', score: '86%', tone: 'text-purple-500', background: 'bg-purple-50' }
	];
</script>

<div class="relative mx-auto max-w-xl">
	<div class="absolute inset-0 -translate-x-10 -translate-y-8 rounded-3xl bg-gradient-to-br from-indigo-200 via-white to-purple-200 opacity-70 blur-[80px]"></div>

	<div class="relative rounded-3xl border border-slate-100 bg-white/90 shadow-[0_35px_120px_-60px_rgba(79,70,229,0.65)] backdrop-blur">
		<div class="flex items-center justify-between border-b border-slate-100 px-6 py-5">
			<div>
				<p class="text-xs uppercase tracking-wide text-indigo-500/80">Active workspace</p>
				<h3 class="text-base font-semibold text-slate-900">Human Ontology • Concept Explorer</h3>
			</div>
			<div class="flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
				<span class="h-2 w-2 rounded-full bg-emerald-500"></span>
				Real-time sync
			</div>
		</div>

		<div class="px-6 py-6">
			<div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
				<div class="rounded-2xl border border-slate-100 bg-white/80 p-5">
					<header class="mb-4 flex items-center justify-between">
						<div>
							<p class="text-xs uppercase tracking-wide text-slate-400">Feature path</p>
							<h4 class="text-lg font-semibold text-slate-900">Sensory processing pathway</h4>
						</div>
						<span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
							Healthy profile
						</span>
					</header>

					<ol class="space-y-3">
						{#each timeline as item}
							<li class="flex items-center gap-3 rounded-xl border border-slate-100/80 bg-slate-50/70 px-3 py-3">
								<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-indigo-500">
									{item.label.slice(0, 1)}
								</div>
								<div class="flex-1">
									<p class="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
									<p class="text-sm font-medium text-slate-900">{item.value}</p>
								</div>
								<span class="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
									{item.tag}
								</span>
							</li>
						{/each}
					</ol>
				</div>

				<div class="space-y-4">
					<div class="rounded-2xl border border-slate-100 bg-slate-900 px-4 py-5 text-white">
						<p class="text-xs uppercase tracking-[0.3em] text-indigo-300">Heat map</p>
						<p class="mt-2 text-3xl font-semibold">3.2M</p>
						<p class="text-xs text-slate-400">Relationships indexed</p>
						<div class="mt-4 h-28 rounded-xl bg-gradient-to-br from-indigo-500/40 via-indigo-400/30 to-purple-400/50">
							<div class="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(165,180,252,0.65),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(196,181,253,0.55),transparent_55%)]"></div>
						</div>
					</div>

					<div class="rounded-2xl border border-slate-100 bg-white/90 p-4">
						<p class="text-xs uppercase tracking-wide text-slate-400">Focus areas</p>
						<ul class="mt-3 space-y-3">
							{#each spotlight as item}
								<li class={`rounded-2xl border border-slate-100 ${item.background} px-4 py-3`}>
									<div class="flex items-center justify-between">
										<p class="text-sm font-semibold text-slate-900">{item.title}</p>
										<span class={`text-sm font-semibold ${item.tone}`}>{item.score}</span>
									</div>
									<p class="mt-1 text-xs text-slate-500">Coverage across datasets</p>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="absolute -bottom-8 -left-12 hidden h-32 w-32 rotate-6 rounded-2xl border border-indigo-100 bg-indigo-50/90 p-4 text-xs font-medium text-indigo-600 shadow-lg shadow-indigo-200 sm:flex sm:flex-col sm:justify-between">
		<span class="uppercase tracking-wider text-indigo-400">Auto QA</span>
		<p>23 issues resolved</p>
		<p class="text-[11px] text-indigo-400">Last sync: 3 minutes</p>
	</div>
</div>

