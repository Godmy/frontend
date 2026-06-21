/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
    "schemaPath": "./schema.graphql",
    "watchSchema": {
        "url": process.env.API_BASE_URL ?? process.env.VITE_GRAPHQL_ENDPOINT ?? "http://localhost:8000/graphql"
    },
    "runtimeDir": ".houdini",
    "plugins": {
        "houdini-svelte": {}
    },
    "scalars": {
        JSON: {
            type: "any"
        }
    },
    "defaultCachePolicy": "CacheAndNetwork",
    "defaultPartial": true,
    "defaultKeys": ["id"]
}

export default config
