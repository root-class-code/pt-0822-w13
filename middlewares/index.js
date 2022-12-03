// custom middlewares
const authMiddleware = (req, res, next) => {
    if ( req.session.loggedInUser) {
        next()
    }
    else {
        res.redirect('/signin')
    }
}

module.exports = {
    authMiddleware 
}