const local = require('passport-local')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()
const { isValidPassword } = require('../utils/passwordHash')
const LocalStrategy = local.Strategy;

const loginLocalStrategy = new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {

            let user = await userManager.getUserByEmail(email)

            if (!user) {
                return done(null, false, { message: 'The user does not exist in the system' })
            }

            if (!isValidPassword(password, user.password)) {
                return done(null, false, { message: 'Incorrect Data' })
            }

            user = await userManager.authenticateUser(user)

            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
);

module.exports = loginLocalStrategy