import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
        adapter: adapter(),

        alias: {
            $houdini: ".houdini/",
            $shared: "src/shared",
            $entities: "src/entities",
            $features: "src/features",
            $widgets: "src/widgets",
            $pages: "src/pages"
        }
    }
};

export default config;
