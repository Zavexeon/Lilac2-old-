const RichEmbed = require('discord.js').MessageEmbed

/* standard functions for bot */
module.exports = {
  name: 'Standard',
  commands: [
    {
      name: 'ping',
      callback: async (ctx) => {
        ctx.message.channel.send('Pong!')
      }
    },
    {
      name: 'help',
      maxArgs: 1,
      arguments: ['command-name'],
      callback: async ctx => {

      }
    },
    {
      name: 'modules',
      callback: async ctx => {
        let embed = new RichEmbed()   
          .setColor('#000000')
          .setTitle('Loaded Modules')

        for (module in ctx.bot.modules) {
          embed
            .addField(module, `${ctx.bot.modules[module].enabled ? 'enabled' : 'disabled'}`)
        }
        ctx.message.channel.send(embed)
      }
    },
    {
      name: 'toggle', 
      minArgs: 1,
      maxArgs: 1,
      arguments: ['module-name'],
      requiredPerms: ['MANAGE_GUILD'],
      callback: async ctx => {
        if (ctx.params[0] === 'Standard') {
          ctx.message.channel.send('Cannot disable standard module.')
        } else {
          let module = ctx.bot.modules[ctx.params[0]]
          if (module) {
            ctx.bot.modules[ctx.params[0]].enabled = module.enabled ? false : true
          } else {
            ctx.message.channel.send('Module not found.')
          }
        }
      }
    }
  ]
}