<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { useAuth } from '$lib/auth';
	import { t } from '$lib/utils/i18n';
	import { LanguageSwitcher } from '$widgets/language-switcher';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	const auth = useAuth();

	type NavTag = 'beta' | 'new' | 'soon';

	type NavItem = {
		id: string;
		label: string;
		href: string;
		description?: string;
		icon?: string;
		tag?: NavTag;
		disabled?: boolean;
		matchPrefix?: boolean;
	};

	type NavSection = {
		id: string;
		label: string;
		items: NavItem[];
	};

	const sections: NavSection[] = [
		{
			id: 'overview',
			label: 'Overview',
			items: [
				{ id: 'home', label: 'Home', href: '/app', matchPrefix: false },
				{ id: 'dashboard', label: 'Dashboard', href: '/app/dashboard', matchPrefix: true },
				{ id: 'activity', label: 'Activity', href: '/activity', tag: 'soon', disabled: true }
			]
		},
		{
			id: 'data-management',
			label: 'Data Management',
			items: [
				{ id: 'concepts', label: 'Concepts', href: '/app/concepts', matchPrefix: true },
				{ id: 'dictionaries', label: 'Dictionaries', href: '/app/dictionaries', matchPrefix: true },
				{ id: 'languages', label: 'Languages', href: '/app/languages', matchPrefix: true },
				{ id: 'data-quality', label: 'Data Quality', href: '/data-quality', tag: 'soon', disabled: true },
				{ id: 'imports', label: 'Imports', href: '/imports', tag: 'soon', disabled: true }
			]
		},
		{
			id: 'analytics',
			label: 'Analytics & Visualization',
			items: [
				{ id: 'visualizations', label: 'Visualization Hub', href: '/app/visualizations', matchPrefix: true },
				{ id: 'ontology-browser', label: 'Ontology Browser', href: '/app/visualizations/ontology-map', matchPrefix: true },
				{ id: 'usage-analytics', label: 'Usage Analytics', href: '/analytics', tag: 'soon', disabled: true },
				{ id: 'legacy-visualization', label: 'Legacy Visualization', href: '/visualization', matchPrefix: true }
			]
		},
		{
			id: 'support',
			label: 'Support & Settings',
			items: [
				{ id: 'admin', label: 'Admin', href: '/app/admin', matchPrefix: true },
				{ id: 'settings', label: 'Settings', href: '/settings', tag: 'soon', disabled: true },
				{ id: 'help', label: 'Help Center', href: '/help', tag: 'soon', disabled: true }
			]
		}
	];

	let currentPath = $derived($page.url.pathname);
	let openSection = $state<string | null>(null);
	let mobileMenuOpen = $state(false);

	// Pull translations from the root layout
	const trans = $derived($page.data.translations || {});

	async function handleLogout() {
		await auth.logout();
		goto('/app/login');
	}

	function isItemActive(item: NavItem): boolean {
		if (item.matchPrefix) {
			return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
		}
		return currentPath === item.href;
	}

	function isSectionActive(section: NavSection): boolean {
		return section.items.some((item) => isItemActive(item));
	}

	function toggleSection(sectionId: string) {
		openSection = openSection === sectionId ? null : sectionId;
	}

	function closeMenus() {
		openSection = null;
		mobileMenuOpen = false;
	}

	$effect(() => {
		// Close dropdowns when the route changes
		currentPath;
		openSection = null;
		mobileMenuOpen = false;
	});
</script>

<nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center space-x-4 md:space-x-8">
				<a href={auth.isAuthenticated ? '/app/dashboard' : '/app'} class="text-2xl font-bold text-indigo-600">
					Multipult
				</a>

				{#if auth.isAuthenticated}
					<div class="hidden md:flex items-center space-x-2">
						{#each sections as section (section.id)}
							<div
								class="relative"
								role="presentation"
								onmouseenter={() => (openSection = section.id)}
								onmouseleave={() => (openSection = null)}
							>
								<button
									type="button"
									class={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
										isSectionActive(section)
											? 'border-indigo-600 text-indigo-600'
											: 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
									}`}
									aria-haspopup="true"
									aria-expanded={openSection === section.id}
									onclick={() => toggleSection(section.id)}
								>
									{section.label}
									<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path
											fill-rule="evenodd"
											d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.96a.75.75 0 111.08 1.04l-4.242 4.53a.75.75 0 01-1.084 0L5.25 8.27a.75.75 0 01-.02-1.06z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>

								{#if openSection === section.id}
									<div class="absolute left-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
										<div class="py-2">
											{#each section.items as item (item.id)}
												{#if item.disabled}
													<div class="px-4 py-2">
														<div class="flex items-center justify-between">
															<span class="text-sm text-gray-400">{item.label}</span>
															{#if item.tag === 'soon'}
																<span class="text-xs font-semibold text-gray-400 uppercase">soon</span>
															{/if}
														</div>
													</div>
												{:else}
													<a
														href={item.href}
														class={`flex items-center justify-between px-4 py-2 text-sm transition-colors ${
															isItemActive(item)
																? 'text-indigo-600 bg-indigo-50'
																: 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
														}`}
													>
														<span>{item.label}</span>
														{#if item.tag}
															<span
																class={`text-xs font-semibold uppercase ${
																	item.tag === 'new'
																		? 'text-emerald-600'
																		: item.tag === 'beta'
																		? 'text-amber-600'
																		: 'text-indigo-500'
																}`}
															>
																{item.tag}
															</span>
														{/if}
													</a>
												{/if}
											{/each}
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>

					<button
						type="button"
						class="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
						aria-expanded={mobileMenuOpen}
						onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					>
						<span class="sr-only">Toggle menu</span>
						{#if mobileMenuOpen}
							<svg class="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{:else}
							<svg class="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						{/if}
					</button>
				{/if}
			</div>

			<div class="flex items-center space-x-4">
				<LanguageSwitcher />
				<ThemeSwitcher />

				{#if auth.isAuthenticated}
					<div class="hidden sm:flex items-center space-x-3">
						<div class="text-right">
							<p class="text-sm font-medium text-gray-900">{auth.user?.username}</p>
							<p class="text-xs text-gray-500">{auth.user?.email}</p>
						</div>

						<div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
							{auth.user?.username?.charAt(0).toUpperCase()}
						</div>
					</div>

					<button
						onclick={handleLogout}
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
					>
						{t(trans, 'ui/button/logout', 'Logout')}
					</button>
				{:else}
					<a href="/app/login" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
						{t(trans, 'ui/button/signIn', 'Sign in')}
					</a>
					<a
						href="/app/register"
						class="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all"
					>
						{t(trans, 'ui/button/getStarted', 'Get Started')}
					</a>
				{/if}
			</div>
		</div>
	</div>

	{#if auth.isAuthenticated && mobileMenuOpen}
		<div class="md:hidden border-t border-gray-200 bg-white">
			<div class="px-4 py-4 space-y-4">
				{#each sections as section (section.id)}
					<div>
						<p class="text-xs font-semibold uppercase text-gray-500 mb-2">{section.label}</p>
						<div class="space-y-1">
							{#each section.items as item (item.id)}
								{#if item.disabled}
									<div class="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-400 bg-gray-100">
										<span>{item.label}</span>
										{#if item.tag}
											<span class="text-xs font-semibold uppercase">{item.tag}</span>
										{/if}
									</div>
								{:else}
									<a
										href={item.href}
										class={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
											isItemActive(item)
												? 'text-indigo-600 bg-indigo-50'
												: 'text-gray-700 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600'
										}`}
										onclick={closeMenus}
									>
										<span>{item.label}</span>
										{#if item.tag}
											<span class="text-xs font-semibold uppercase">{item.tag}</span>
										{/if}
									</a>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</nav>
