// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
}

// Middleware to check if user is NOT authenticated (for login/register pages)
function isNotAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard');
    }
    next();
}

module.exports = { isAuthenticated, isNotAuthenticated };
