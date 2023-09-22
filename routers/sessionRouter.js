const passport = require('passport')
const UserManagerMongo = require('../dao/UserManagerMongo')
const BaseRouter = require('./BaseRouter');
const { requireLogin } = require('../middlewares/sessionMiddlewares');
const userManager = new UserManagerMongo()

class SessionRouter extends BaseRouter {
    init() {
        this.post('/register', passport.authenticate('register', {
            failureRedirect: '/register',
            failureFlash: true
        }), (req, res) => {
            req.session.destroy()
            return res.redirect('/')
        });

        this.post('/', passport.authenticate('login', {
            successRedirect: '/products',
            failureRedirect: '/',
            failureFlash: true,
        }));

        this.get('/github', passport.authenticate('github', {
            scope: ['user:email']
        }));

        this.get('/github-callback', passport.authenticate('github', { failureRedirect: '/' }),
            (req, res) => {
                req.session.user = req.user;
                res.redirect('/products')
            });

        this.get('/current', requireLogin, (req, res) => {
            const sessionModel = {
                session: req.session,
                user: req.user
            }
            res.sendSuccess(200, {
                sessionModel
            })
        })

        this.post('/recoverypassword', async (req, res) => {
            {
                const { email, password } = req.body
                const contentType = req.headers['content-type']
                try {
                    await userManager.resetPassword(email, password)
                    if (contentType === 'application/json') {
                        return res.sendSuccess(200, 'Recovered password')
                    }
                    res.redirect('/')
                } catch (error) {
                    if (contentType === 'application/json') {
                        return res.sendError(500, 'Password recovery error', error);
                    }
                    return res.redirect(`/error?errorMessage=${error.message}`)
                }
            }
        });

        this.delete('/:userId', async (req, res) => {
            const { userId } = req.params
            const contentType = req.headers['content-type']
            try {
                await userManager.deleteAccount(userId)
                req.session.destroy((err) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.sendSuccess(200, 'User account deleted')
                });
            } catch (error) {
                if (contentType === 'application/json') {
                    return res.sendError(500, 'Error deleting user account', error);
                }
                return res.redirect(`/error?errorMessage=${error.message}`)
            }
        });
    }
}

module.exports = SessionRouter