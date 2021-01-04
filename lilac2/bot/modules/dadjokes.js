/* Courtesy of CodeMonkey51 */

module.exports = (bot, cache) => {
    return {
        name: 'dad-jokes',
        description: 'eveyone likes dad jokes, this is a module to give you some',
        commands: {
            im: {
                description: 'Hi dad im bored. dad: Hi bored',
                minArgs: 1,
                maxArgs: 1000,
                arguments: ['name'],
                callback: (message, guild, args) => {
                    message.channel.send({embed: {
                        title: 'Hello!',
                        description: 'Hello ' + args.join(' ') +'!'
                    }})
                }
            }
        }
    }
}
