import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
// dist установленного из npm пакета stylist-svelte (resolve учитывает hoisting в workspace)
const stylistDist = dirname(createRequire(import.meta.url).resolve('stylist-svelte'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	// stylist-svelte's mandatory architecture (AGENTS.md) passes `$props()` into
	// `function/state/<name>` factories that internally wrap every read in `$derived`.
	// The Svelte compiler can't statically verify that and flags every call site with
	// `state_referenced_locally`, even though reactivity is preserved. Silence just
	// that code; let every other warning through unchanged.
	onwarn: (warning, defaultHandler) => {
		if (warning.code === 'state_referenced_locally') return;
		defaultHandler(warning);
	},
	kit: {
        adapter: adapter(),

        alias: {
            $houdini:  ".houdini/",
            // Приватные модули (git submodules в src/module/*)
            $module:   resolve(__dirname, 'src/module'),
            // Модули импортируют себя как $stylist/<module>/..., а библиотеку — как $stylist/<domain>/...
            // Более специфичный alias модуля должен идти раньше общего $stylist.
            '$stylist/auth': resolve(__dirname, 'src/module/auth'),
            $stylist:  stylistDist,
            $frontend: resolve(__dirname, 'src'),
            $pages:    resolve(__dirname, 'src/pages')
        }
    }
};

export default config;
