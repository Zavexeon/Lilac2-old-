const db = require('../../database/db.js')

module.exports = (bot, cache) => {
    return {
        name: 'standard',
        description: 'The standard bot commands.',
        commands: {
            ping: {
                description: 'Test ping the bot.',
                callback: message => {
                    message.channel.send('Pong.')
                }
            },
            help: {
                description: 'Display available commands.',
                callback: (message, guild) => {
                    let embed = {
                        color: 8401595,
                        title: "Available commands for this server:",
                        fields: []
                    }

                    for (command in bot.commands) {
                        if (guild.enabledModules.includes(bot.commands[command].from)) {
                            const commandObj = bot.commands[command]
                            embed.fields.push({
                                name: "`" + guild.prefix + ` ${command}` + "`",
                                value: commandObj.description
                            })
                        }
                    }
                    message.channel.send({embed: embed})
                }
            },
            modules: {
                description: 'View available modules and whether they are enabled in this guild or not.',
                callback: (message, guild) => {
                    let embed = {
                        title: 'Lilac2 Modules',
                        fields: []
                    }

                    for (module in bot.modules) {
                        embed.fields.push({
                            name: `${module}: ${guild.enabledModules.includes(module) ? 'enabled' : 'disabled'}`,
                            value: bot.modules[module].description
                        })
                    }

                    message.channel.send({embed: embed})
                }
            },
            prefix: {
                description: 'Change the prefix for this guild.',
                arguments: ['new-prefix'],
                minArgs: 1,
                maxArgs: 1,
                callback: async (message, guild, args) => {
                    await db.guildSetPrefix(message.guild.id, args[0])
                    await cache.updateGuildCache(message.guild.id)
                    await message.channel.send(`Updated prefix to \`${prefix}\`.`)
                }
            }
        }
    }
}