<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import AudioRecordButton from '$stylist/audio/component/atom/audio-record-button/index.svelte';
	import type { SlotAudioRecording } from '$stylist/audio/interface/slot/audio-recording';

	const auth = useAuth();

	let transcript = $state('');
	let reply = $state('');
	let isSending = $state(false);
	let sendError = $state('');

	onMount(() => {
		if (auth.isAuthenticated) goto(`/${auth.roles[0]?.name ?? 'user'}`);
	});

	// Запись → /api/transcription (whisper) → /api/voice-chat (локальная LLM)
	async function handleRecorded(recording: SlotAudioRecording) {
		isSending = true;
		sendError = '';
		transcript = '';
		reply = '';
		try {
			const form = new FormData();
			form.set('file', recording.file, recording.fileName);
			const transcription = await fetch('/api/transcription', { method: 'POST', body: form });
			const transcriptionPayload = await transcription.json();
			if (!transcription.ok) throw new Error(transcriptionPayload.message ?? 'Transcription failed');
			transcript = transcriptionPayload.text ?? '';
			if (!transcript.trim()) return;

			const response = await fetch('/api/voice-chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: transcript })
			});
			const payload = await response.json();
			if (!response.ok) throw new Error(payload.message ?? 'Request failed');
			reply = payload.reply ?? '';
		} catch (err) {
			sendError = err instanceof Error ? err.message : String(err);
		} finally {
			isSending = false;
		}
	}
</script>

<div class="c-landing">
	<div class="c-landing__card">
		<nav class="c-landing__nav">
			<a href="/login" class="c-landing__nav-link">Sign In</a>
			<a href="/register" class="c-landing__nav-link c-landing__nav-link--primary">Create Account</a>
		</nav>

		<h1 class="c-landing__title">Voice Assistant</h1>
		<p class="c-landing__subtitle">Record your voice — the transcript is sent to the local AI</p>

		<AudioRecordButton
			onRecorded={handleRecorded}
			onError={(err) => (sendError = err.message)}
			disabled={isSending}
		/>

		{#if transcript}
			<p class="c-landing__transcript">{transcript}</p>
		{/if}

		{#if isSending}
			<p class="c-landing__status">Waiting for the AI response…</p>
		{:else if sendError}
			<p class="c-landing__error">{sendError}</p>
		{:else if reply}
			<div class="c-landing__reply">{reply}</div>
		{/if}
	</div>
</div>

<style>
	.c-landing {
		min-height: 100vh;
		background: linear-gradient(
			135deg,
			var(--color-primary-50, #eef2ff),
			var(--color-primary-100, #e0e7ff)
		);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}
	.c-landing__transcript {
		margin-top: 1rem;
		color: var(--color-text-secondary, #4b5563);
		font-style: italic;
	}
	.c-landing__card {
		max-width: 32rem;
		width: 100%;
		background: var(--color-background-primary, #fff);
		border-radius: var(--radius-xl, 1rem);
		box-shadow: 0 20px 40px rgb(0 0 0 / 0.1);
		padding: 2rem;
		display: grid;
		gap: 1rem;
	}
	.c-landing__nav {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}
	.c-landing__nav-link {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary, #6b7280);
		text-decoration: none;
	}
	.c-landing__nav-link--primary {
		color: var(--color-primary-600, #4f46e5);
	}
	.c-landing__nav-link:hover {
		text-decoration: underline;
	}
	.c-landing__title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary, #111827);
		margin: 0;
		text-align: center;
	}
	.c-landing__subtitle {
		color: var(--color-text-secondary, #6b7280);
		margin: 0 0 0.5rem;
		text-align: center;
	}
	.c-landing__status {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary, #6b7280);
		text-align: center;
	}
	.c-landing__error {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-danger-600, #dc2626);
		text-align: center;
	}
	.c-landing__reply {
		padding: 0.85rem;
		border: 1px solid var(--color-border-primary, #e5e7eb);
		border-radius: 0.5rem;
		background: var(--color-background-secondary, #f9fafb);
		color: var(--color-text-primary, #111827);
		white-space: pre-wrap;
	}
</style>
