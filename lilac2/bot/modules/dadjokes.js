module.exports = (bot, cache) => {
    return {
        name: 'dad jokes',
        description: 'eveyone likes dad jokes, this is a module to give you some',
        commands: {
            im: {
                description: 'Hi dad im bored. dad: Hi bored',
                minArgs: 1,
                maxArgs: 1,
              
            }
        }
    }
}
