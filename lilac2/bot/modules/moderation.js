const db = require('../../database/db.js')

module.exports = (bot, cache) => {
    const messageHook = async message => {
        if (cache.moduleEnabled(message.guild.id, 'moderation')) {
            if (!cache.getGuild(message.guild.id).moderation) {
                db.addModeration(message.guild.id)
                cache.updateGuildCache(message.guild.id)
            }
        }
        const guild = cache.getGuild(message.guild.id)

        for (word in guild.moderation.bannedWords) {
            const wordObj = guild.moderation.bannedWords[word]

            if (wordObj.indirectMatching) {
                
            } else { 
                if (message.content.includes(word)) {
                    message.delete()
                }
            }
        } 
    }

    const deleteHook = async message => {

    }

    const editHook = async (oldMessage, newMessage) => {

    }

    return {
        name: 'moderation',
        description: 'A module full of moderating tools',

        messageHook: messageHook,
        deleteHook:  deleteHook,
        editHook:    editHook,

        commands: {
            logchannel: {
                minArgs: 1,
                maxArgs: 1,
                arguments: ['channel-id'],
                requiredPerms: ['MANAGE_GUILD'],
                callback: (message, guild, args) => {
                    let channelId = args[0]
                    if (message.mentions.channels.size > 0) {
                        channelId = message.mentions.channels.first().id
                    }
                    const channel = bot.guilds.get(message.guild.id)
                                        .channels.get(channelId) 
     
                }
            }
        }
    }
}