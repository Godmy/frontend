<script lang="ts">
	// Временная замена user/account-settings-form, которой нет в stylist-svelte 2.0.0
	import type { AccountSettings } from '$lib/user/type/object/account-settings';

	let {
		name = '',
		email = '',
		submitLabel = 'Save',
		onSubmit
	}: {
		name?: string;
		email?: string;
		submitLabel?: string;
		onSubmit?: (settings: AccountSettings) => void;
	} = $props();

	let draftName = $state('');
	let draftEmail = $state('');

	$effect.pre(() => {
		draftName = name;
		draftEmail = email;
	});

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		onSubmit?.({ name: draftName.trim(), email: draftEmail.trim() });
	}
</script>

<form class="c-account-settings-form" onsubmit={handleSubmit}>
	<label class="c-account-settings-form__field">
		<span class="c-account-settings-form__label">Name</span>
		<input class="c-account-settings-form__input" bind:value={draftName} autocomplete="name" />
	</label>
	<label class="c-account-settings-form__field">
		<span class="c-account-settings-form__label">Email</span>
		<input
			class="c-account-settings-form__input"
			type="email"
			bind:value={draftEmail}
			autocomplete="email"
		/>
	</label>
	<button class="c-account-settings-form__submit" type="submit">{submitLabel}</button>
</form>

<style>
	.c-account-settings-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 28rem;
	}
	.c-account-settings-form__field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.c-account-settings-form__label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary, #4b5563);
	}
	.c-account-settings-form__input {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border-primary, #d1d5db);
		border-radius: var(--radius-md, 0.375rem);
		background: var(--color-background-primary, #fff);
		color: var(--color-text-primary, #111827);
	}
	.c-account-settings-form__submit {
		align-self: flex-start;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: var(--radius-md, 0.375rem);
		background: var(--color-primary-600, #4f46e5);
		color: var(--color-text-inverse, #fff);
		font-weight: 500;
		cursor: pointer;
	}
	.c-account-settings-form__submit:hover {
		background: var(--color-primary-700, #4338ca);
	}
</style>
