module.exports = (bot, cache) => {
    return [
        require('./standard')(bot, cache),
        require('./moderation')(bot, cache),
        require('./random')(bot, cache)
    ]
}
