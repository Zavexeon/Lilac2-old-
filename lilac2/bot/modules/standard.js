const db = require('../../database/db.js')

module.exports = (bot, cache) => {
    return {
        name: 'standard',
        description: 'The standard bot commands',
        commands: {
            latency: {
                description: 'Test the latency of the bot.',
                callback: message => {
                    message.channel.send({embed: {
                        title: 'Latency',
                        description: `${Date.now() - message.createdTimestamp} milliseconds`,
                        color: 11219690
                    }})
                }
            },
            help: {
                description: 'Display available commands.',
                callback: (message, guild) => {
                    let embed = {
                        color: 11219690,
                        title: "Available commands to you:",
                        fields: []
                    }

                    for (command in bot.commands) {
                        if (guild.enabledModules.includes(bot.commands[command].from)) {
                            let argString = ''
                            if (bot.commands[command].arguments) {
                                bot.commands[command].arguments.forEach(argument => {
                                    argString += `<${argument}> `
                                })
                            }

                            if (bot.commands[command].requiredPerms) {
                                if (message.member.hasPermission(bot.commands[command].requiredPerms)) {
                                    const commandObj = bot.commands[command]
                                    embed.fields.push({
                                        name: `\`${guild.prefix} ${command} ${argString}\``, //"`" + guild.prefix + ` ${command}` + "`",
                                        value: commandObj.description
                                    })
                                }
                            } else {
                                const commandObj = bot.commands[command]
                                embed.fields.push({
                                    name: `\`${guild.prefix} ${command} ${argString}\``, //"`" + guild.prefix + ` ${command}` + "`",
                                    value: commandObj.description
                                })
                            }
                        }
                    }
                    message.channel.send({embed: embed})
                }
            },
            modules: {
                description: 'View available modules and whether they are enabled in this guild or not.',
                callback: (message, guild) => {
                    let embed = {
                        color: 11219690,
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
                requiredPerms: ['MANAGE_MESSAGES'],
                minArgs: 1,
                maxArgs: 1,
                callback: async (message, guild, args) => {
                    if (args[0].length < 10) {
                        await db.guildSetPrefix(message.guild.id, args[0])
                        await cache.updateGuildCache(message.guild.id)
                        //await message.channel.send(`Updated prefix to \`${args[0]}\`.`)
                        await message.channel.send({embed: {
                            title: 'Changed Prefix',
                            description: `Updated prefix for this guild to \`${args[0]}\`!`,
                            color: 3134747
                        }})
                    } else {
                        await message.channel.send(bot.error('Prefix is too long! It can only be up to 10 characters long.'))
                    }
                }
            },
            about: {
                description: 'About the bot.',
                callback: message => {
                    message.channel.send({embed: {
                        title: 'About Lilac2',
                        color: 11219690,
                        fields: [
                            {
                                name: 'Version',
                                value: bot.version
                            }, 
                            {
                                name: 'Github',
                                value: 'https://github.com/Zavexeon/Lilac2'
                            }, 
                            {
                                name: 'Author',
                                value: 'Zavexeon#5296'
                            }
                        ]
                    }})
                }
            },
            toggle: {
                description: 'Toggle modules on and off.',
                requiredPerms: ['MANAGE_MESSAGES'],
                arguments: ['module'],
                minArgs: 1,
                maxArgs: 1,
                callback: async (message, guild, args) => {
                    let toggleStatus
                    
                    if (args[0] !== 'standard') {
                        const guildObj = await db.getGuild(message.guild.id)

                        if (args[0] in bot.modules) {
                            if (cache.moduleEnabled(message.guild.id, args[0])) {
                                await db.guildDisableModule(message.guild.id, args[0])
                                toggleStatus = 'disabled'
                            } else {
                                await db.guildEnableModule(message.guild.id, args[0])
                                toggleStatus = 'enabled'
                            }

                            await message.channel.send({embed: {
                                title: 'Toggled Module',
                                description: `The module **${args[0]}** has been ${toggleStatus}.`
                            }})

                            await cache.updateGuildCache(message.guild.id)
                        } else {
                            await message.channel.send(bot.error('Module does not exist.'))
                        }
                    } else {
                        await message.channel.send(bot.error("You can't disable the standard module, silly!"))
                    }
                }
            },
            say: {
                description: 'Make the bot say something!',
                requiredPerms: ['MANAGE_MESSAGES'],
                arguments: ['channel-id', 'to-say'],
                minArgs: 2,
                maxArgs: 1000,
                callback: (message, guild, args) => {
                    let channelId = args[0]
                    if (message.mentions.channels.size > 0) {
                        channelId = message.mentions.channels.first().id
                    }
                    const channel = bot.guilds.get(message.guild.id)
                                        .channels.get(channelId) 
                    
                    args.shift()
                    channel.startTyping()
                    bot.setTimeout(() => {
                        channel.stopTyping()
                        channel.send(args.join(' '))
                    }, args.length * 280)

                    message.delete()
                }
            },
            cache: {
                description: 'Dumps cache for this guild.',
                requiredPerms: ['MANAGE_MESSAGES'],
                callback: (message, guild, args) => {
                    let prettyString = JSON.stringify(cache.getGuild(message.guild.id), null, '\t')
                    message.author.send({embed: {

                        title: `${message.guild.name} Cache`,
                        description: `\`\`\`js\n${prettyString}\n\`\`\``
                    }})

                    message.channel.send({embed: {
                        title: 'Cache Sent',
                        description: 'Sent you the cache! :thumbsup:'
                    }})
                }
            }
        }
    }
}