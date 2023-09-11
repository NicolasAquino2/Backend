const { Router } = require('express')
const passport = require('passport')
const sessionRouter = new Router()
const UserManagerMongo = require('../dao/UserManagerMongo')
const userManager = new UserManagerMongo()

sessionRouter.post('/register',
    passport.authenticate('register', {
        failureRedirect: '/register',
        failureFlash: true
    }), (req, res) => {
        req.session.destroy()
        return res.redirect('/')
    }
);

sessionRouter.post('/',
    passport.authenticate('login', {
        successRedirect: '/products',
        failureRedirect: '/',
        failureFlash: true
    })
);

sessionRouter.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}))

sessionRouter.get('/github-callback', passport.authenticate('github', { failureRedirect: '/' }),
    async (req, res) => {
        req.session.user = req.user
        res.redirect('/products')
    })

sessionRouter.post('/recoverypassword', async (req, res) => {
    const { email, password } = req.body
    const contentType = req.headers['content-type'];
    try {
        await userManager.resetPassword(email, password)
        return res.redirect('/')
    } catch (error) {
        const commonErrorMessage = 'Error al resetear la contraseña'
        if (contentType === 'application/json') {
            return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
        }
        return res.redirect(`/error?errorMessage=${commonErrorMessage}: ${error.message}`);
    }
})

sessionRouter.delete('/:userId', async (req, res) => {
    const userId = req.params.userId
    const contentType = req.headers['content-type'];
    try {
        await userManager.deleteAccount(userId)
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
            }
            return res.status(202).json({ status: 'deleted', message: 'User account deleted' });
        });

    } catch (error) {
        const commonErrorMessage = 'Error al eliminar el usuario'
        if (contentType === 'application/json') {
            return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
        }
        return res.redirect(`/error?errorMessage=${commonErrorMessage}: ${error.message}`);
    }
})


module.exports = sessionRouter