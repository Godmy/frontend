import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import houdiniPreprocess from 'houdini-svelte/preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), houdiniPreprocess()],
	kit: {
        adapter: adapter(),

        alias: {
            $houdini: ".houdini/"
        }
    }
};

export default config;
