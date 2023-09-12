const githubSt = require('passport-github2')
const UserManagerMongo = require('../dao/UserManagerMongo')
const userManager = new UserManagerMongo()
//const CLIENT_ID = process.env.CLIENT_ID;
//const CLIENT_SECRET = process.env.CLIENT_SECRET;

const githubStrategy = new githubSt({
    clientID: 'd51b31fb9567266c544c',
    clientSecret: '3060e99b58e9806b7f600bfd59f614d31a7b8295',
    callbackUrl: 'http://localhost:8080/api/sessions/github-callback'
}, async (accessToken, refreshToken, profile, done) => {
    

    try {
        // console.log(profile)
        let user = await userManager.getUserByUsername(profile.username)

        if (!user) {
            let newUser = { name: profile.username, lastname: '', email: profile._json.email, age: 18, password: '' }
            let result = await userManager.createUser(newUser)
            //   console.log(result)
            return done(null, result)
        } else {
            return done(null, user)
        }

    } catch (error) {
        return done(error)
    }
})

module.exports = githubStrategy