let { prefix, modules, token } = require('./config')

const Discord = require('discord.js'),
      lilac   = new Discord.Client()


lilac.commands = {} // adds commands property to bot
lilac.modules = {} // adds modules property to bot


modules.forEach(module => {
  let moduleObject = require('./bot_modules/' + module)
  lilac.modules[moduleObject.name] = {enabled: true}

  moduleObject.commands.forEach(command => {
    let commandObject = command
    commandObject['module'] = moduleObject.name
    lilac.commands[command.name] = commandObject
  })
})


lilac.on('message', async message => {
  if (message.content.startsWith(prefix)) {
    const params = message.content
      .split(/(\s+)/)
      .filter(string => !/^\s*$/.test(string))
      .slice(1)


    /* context to be passed to callback function */           
    let context = { 
      params: params.slice(1),
      message: message,
      bot: lilac, 
    }

  
    const command = lilac.commands[params[0]]
    if (command) {
      const argCount = context.params.length
      /* could probably clean this up more */
      if (!(argCount < (command.minArgs || 0) || argCount > (command.maxArgs || 0))) {
        if (command.requiredPerms) {
          if (message.member.permissions.any(command.requiredPerms)) {
            command.callback(context)
          } else {
            message.channel.send('Not enough permissions to use this command!') // give more specific error desc here
          }
        } else {
          command.callback(context)
        }
      } else {
        message.channel.send('Wrong number of arguments!') // give more specific error desc here
      }
    }
  }
})

lilac.login(token)