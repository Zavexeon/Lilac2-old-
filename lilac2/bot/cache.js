const db = require('../database/db.js')

let cache = {
    guilds: {
        /* 
            <guild-id>: {
                prefix: <prefix>
            }
        */
    },

    clear: () => {
        // clears the cache to prevent memory overload
        cache.guilds = null
        cache.guilds = {}
    },

    hasGuild: id => {
        return id in cache.guilds
    },

    getGuild: id => {
        return cache.guilds[id]
    },

    addGuild: (id, guildObj) => {
        cache.guilds[id] = guildObj
    },

    moduleEnabled: module => {
        return cache.guilds[id].enabledModules.includes(module)
    },

    updateGuildCache: async id => {
        cache.addGuild(id, await db.getGuild(id))
    }
}

module.exports = cache