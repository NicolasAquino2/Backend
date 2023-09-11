const passport = require('passport')
const githubStrategy = require('../strategies/githubStrategy')
const loginLocalStrategy = require('../strategies/loginLocalStrategy')
const registerLocalStrategy = require('../strategies/registerLocalStrategy')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()

const initializePassport = () => {
    passport.use('register', registerLocalStrategy)
    passport.use('login', loginLocalStrategy)
    passport.use('github', githubStrategy)

    passport.serializeUser((user, done) => {
        try {
            console.log('serializeUser')
            done(null, user._id)
        } catch (error) {
            return done(error)
        }

    })

    passport.deserializeUser(async (id, done) => {
        try {
            console.log('deserializeUser')
            const user = await userManager.getUserById(id)
            done(null, user)
        } catch (error) {
            return done(error)
        }
    })
}

module.exports = initializePassport