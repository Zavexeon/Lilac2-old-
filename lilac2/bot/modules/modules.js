module.exports = (bot, cache) => {
    return [
        require('./standard')(bot, cache),
        require('./moderation')(bot, cache)
    ]
}
