const admin = require('firebase-admin')

admin.initializeApp({
    credential: admin.credential.cert(
        require('./key.js')
    )
})

const db = admin.firestore()

const database = {
    addGuild: async guildObj => {
        /*
        guildObj = {
            id: <guild-id>,
        }
        */
        db.collection('guilds').doc(guildObj.id)
            .set({
                prefix: '!lilac',
                enabledModules: ['standard']
            })
    },

    getGuild: async guildId => {
        guildDoc = db.collection('guilds').doc(guildId)
        return new Promise((resolve, reject) => {
            guildDoc.get()
                .then(snapshot => {
                    if (snapshot.exists) {
                        guildDoc.onSnapshot(doc => {
                            resolve(doc.data())
                        })
                    } else {
                        database.addGuild({id: guildId})
                    }
            })
        })
    },

    guildSetPrefix: async (guildId, prefix) => {
        db.collection('guilds').doc(guildId)
            .update({
                prefix: prefix
            })
    },

    guildEnableModule: async (guildId, module) => {
        db.collection('guilds').doc(guildId)
            .update({
                enabledModules: admin.firestore.FieldValue.arrayUnion(module)
            })
    },

    guildDisableModule: async (guildId, module) => {
        db.collection('guilds').doc(guildId)
            .update({
                enabledModules: admin.firestore.FieldValue.arrayRemove(module)
            })
    },

    addModeration: guildId => {
        db.collection('guilds').doc(guildId)
            .update({
                moderation: {
                    bannedWords: [],
                    logChannel: null,
                    filterEnabled: false,
                }
            })  
    }
}

module.exports = database