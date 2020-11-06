class Die {
    constructor(sides) {
        this.sides = sides 
    }

    roll(times=1) {
        let total = 0
        for (let i=0; i<times; i++) {
            total += Math.ceil(Math.random() * this.sides)
        }
    }
}

module.exports = (bot, cache) => {
    return {
        name: 'random',
        description: 'A module for generating random things',
        commands: {
            roll: {
                description: 'Roll a dice.',
                minArgs: 0,
                maxArgs: 1,
                arguments: ['?dice-string'],
                callback: (message, guild, args) => {
                    let result 

                    if (!args[0]) {
                        result = new Die(6).roll()
                    } else {

                    }

                    console.log(result)
                    message.channel.send({embed: {
                        title: 'Rolled some dice!',
                        description: result
                    }})
                }
            }
        }
    }
}