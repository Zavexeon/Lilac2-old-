const Discord = require('discord.js'),
      lilac   = new Discord.Client(),
      db      = require('../database/db.js'),
      cache   = require('./cache.js'),
      modules = require('./modules/modules.js')(lilac, cache),
      config  = require('../config.js')

lilac.commands = {} 
lilac.modules = {}

modules.forEach(module => {
    for (command in module.commands) {
        let commandObject = module.commands[command] 
        commandObject.from = module.name
        lilac.commands[command] = commandObject
    }
    lilac.modules[module.name] = {description: module.description}
})

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
})

lilac.on('message', async message => {
    const discordGuild = message.guild // discord.js guild object

    if (!cache.hasGuild(discordGuild.id)) {
        cache.addGuild(discordGuild.id, await db.getGuild(discordGuild.id))
    }
    let guild = cache.getGuild(discordGuild.id)


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

                console.log(args)

                if((minArgs <= args.length) && (maxArgs >= args.length)) {      
                    lilac.commands[command.callback(message, guild, args)]
                } else {
                    message.channel.send('aRgumENT cOUnt ErroR reeeeeee (temp error message)')
                }
            }

            if (guild.enabledModules.includes(command.from)) {
                if (command.requiredPerms) {
                    if(message.member.hasPermissions(command.requiredPerms)) {
                        executeCommand()
                    }
                } else {
                    executeCommand()
                }
            }
        } 
    }
})

lilac.on('guildCreate', async guild => await db.addGuild({id: guild.id}))

lilac.setTimeout(() => cache.clear(), 1800000) // clears cache every 30 minutes

lilac.login(config.token)