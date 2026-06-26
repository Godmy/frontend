import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylistPath = existsSync(resolve(__dirname, '../stylist-svelte/src/lib'))
	? resolve(__dirname, '../stylist-svelte/src/lib')
	: resolve(__dirname, 'stylist-svelte/src/lib');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
        adapter: adapter(),

        alias: {
            $houdini:  ".houdini/",
            $stylist:  stylistPath,
            $frontend: resolve(__dirname, 'src'),
            $pages:    resolve(__dirname, 'src/pages')
        }
    }
};

export default config;
