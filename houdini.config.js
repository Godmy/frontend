/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
    "watchSchema": {
        "url": "http://127.0.0.1:8000/graphql/"
    },
    "runtimeDir": ".houdini",
    "plugins": {
        "houdini-svelte": {}
    },
    "scalars": {
        // Add custom scalar types here if needed
    },
    "defaultCachePolicy": "CacheAndNetwork",
    "defaultPartial": true,
    "defaultKeys": ["id"]
}

export default config
