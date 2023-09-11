const haveSession = (req, res, next) => {
    if (req.user) {
        return res.redirect('/profile')
    }
    return next()
}

const requireLogin = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/')
    }
    return next()
}

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.redirect('/')
    }
    return next()
}

module.exports = {
    haveSession, requireAdmin, requireLogin
}