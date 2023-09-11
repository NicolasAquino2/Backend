const local = require('passport-local')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()
const LocalStrategy = local.Strategy;

const registerLocalStrategy = new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
        const { name, lastname, email, age } = req.body

        try {
            let user = await userManager.getUserByEmail(username)

            if (user) {
                return done(null, false, { message: 'There is already a user with that email' });
            }

            if (!name || !lastname || !email || !age || !password) {
                return done(null, false, { message: 'All fields are required' });
            }

            let newUser = { name, lastname, email, age, password }
            let result = await userManager.createUser(newUser)
            return done(null, result);
        } catch (error) {
            return done(error)
        }
    }
);

module.exports = registerLocalStrategy