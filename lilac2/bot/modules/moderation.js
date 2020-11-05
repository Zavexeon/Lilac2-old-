const db = require('../../database/db.js')

module.exports = (bot, cache) => {
    const messageHook = async message => {
        if (cache.moduleEnabled(message.guild.id, 'moderation')) {
            if (!cache.getGuild(message.guild.id).moderation) {
                db.addModeration(message.guild.id)
                cache.updateGuildCache(message.guild.id)
            }
        }
    }

    return {
        name: 'moderation',
        description: 'A module full of moderating tools',
        messageHook: messageHook,
        commands: {
            
        }
    }
}