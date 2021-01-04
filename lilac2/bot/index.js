const Discord = require('discord.js'),
      lilac   = new Discord.Client(),
      db      = require('../database/db.js'),
      cache   = require('./cache.js'),
      modules = require('./modules/modules.js')(lilac, cache),
      config  = require('../config.js'),
      os      = require('os')

//let guildCount = 0

/* add some properties to the bot */
lilac.commands     = {} 
lilac.modules      = {}
lilac.version      = config.version
lilac.messageHooks = []
lilac.deleteHooks  = []
lilac.editHooks    = []

lilac.error = errorText => {
    return {embed: {
        title: 'Error',
        description: errorText,
        color: 16723712
    }}
} 


/* loads modules from modules/modules.js */
console.log('Loading modules...')
modules.forEach(module => {
    if (module.messageHook) lilac.messageHooks.push(module.messageHook)
    if (module.deleteHook)  lilac.deleteHooks.push(module.deleteHook)
    if (module.editHook)    lilac.editHooks.push(module.editHook)

    for (command in module.commands) {
        let commandObject = module.commands[command] 
        commandObject.from = module.name
        lilac.commands[command] = commandObject
    }

    lilac.modules[module.name] = {description: module.description}
    console.log(`\tLoaded ${module.name} module`)
})
console.log('Modules loaded')



lilac.on('ready', () => {
    if (config.replit) {
        console.log('Running on replit detected, starting webserver...')
        require('http')
            .createServer((req, res) => {
                res.end('Bot is online!')
            })
            .listen(3000)
    }    
    console.log('Bot is ready!')


    /* changes presence every x seconds */
    let presenceCount = 0
    lilac.setInterval(() => {
        const lilacPresences = [
            {   
                game: {
                    type: 'WATCHING',
                    name: `for pings!`
                }
            },
            {
                game: {
                    type: 'LISTENING',
                    name: `${lilac.guilds.size} servers!`
                }
            },
            {
                game: {
                    type: 'PLAYING', 
                    name: `with ${Math.round((os.totalmem() - os.freemem()) / 10000000)}/${Math.round(os.totalmem() / 10000000)}mb of ram!`
                }
            }
        ]

        if (presenceCount === lilacPresences.length) presenceCount = 0
        lilac.user.setPresence(lilacPresences[presenceCount])
        presenceCount++
    }, 5000)
})



lilac.on('message', async message => {
    if (message.guild !== null) { //ignores all messages not in a server
        if (!message.author.bot) { // ignores bot messages
            const discordGuild = message.guild // discord.js guild object


            /* checks cache for guild, if not present adds to cache from database */
            if (!cache.hasGuild(discordGuild.id)) {
                cache.addGuild(discordGuild.id, await db.getGuild(discordGuild.id))
            }
            let guild = cache.getGuild(discordGuild.id)

            if (message.isMemberMentioned(lilac.user)) {
                message.channel.send({embed: {
                    title: 'Hiya!',
                    description: `Hey there, my prefix is \`${guild.prefix}\`! Try running \`${guild.prefix} help\`!`,
                    color: 11219690
                }})
            } else {
                const splitMessage = message.content.split(/\s+/)

                if (splitMessage[0] === guild.prefix) {
                    if (splitMessage[1] in lilac.commands) {
                        const command = lilac.commands[splitMessage[1]]

                        function executeCommand() {
                            // shift twice to remove first two strings (<prefix> <command>)
                            splitMessage.shift()
                            splitMessage.shift() 

                            let args = splitMessage
                
                            const maxArgs = command.maxArgs || 0
                                  minArgs = command.minArgs || 0

                            if((minArgs <= args.length) && (maxArgs >= args.length)) {      
                                lilac.commands[command.callback(message, guild, args)]
                            } else {
                                let argString = ''
                                if (command.arguments) {
                                    command.arguments.forEach(argument => argString += `<${argument}> `)
                                }
                                message.channel.send(lilac.error(`This command takes **${minArgs}-${maxArgs}** arguments. Example: \`${guild.prefix} ${argString}\``))
                            }
                        }

                        if (guild.enabledModules.includes(command.from)) {
                            if (command.requiredPerms) {
                                if(message.member.hasPermission(command.requiredPerms)) {
                                    executeCommand()
                                } else {
                                    message.channel.send('Missing Permission '+command.requiredPerms)
                                }
                            } else {
                                executeCommand()
                            }
                        }
                    } 
                }
            }
        }

        lilac.messageHooks.forEach(hook => hook(message)) // gives external modules a hook for listening to messages
    }
})

lilac.on('messageDelete', async message => lilac.deleteHooks.forEach(hook => hook(message)))
lilac.on('messageUpdate', async (messageOld, messageNew) => lilac.editHooks.forEach(hook => hook(messageOld, messageNew)))

lilac.on('guildCreate', async guild => await db.addGuild({id: guild.id}))



lilac.setInterval(() => cache.clear(), 1800000) // clears cache every 30 minutes

/*
lilac.setTimeout(() => {
    require('shelljs')
        .exec('./restart.sh')
}, 21600000)
*/

lilac.login(config.token)