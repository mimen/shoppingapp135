function verifyLoggedIn(req, res, next) {
	console.log(req.session);
	// Check that the session contains a user.
    if (!req.session || !req.session.user) {
    	// User is logged out, redirect to login page.
        res.redirect('/login/');
    } else {
    	// User is logged in, continue with the request.
        next();
    }
}

module.exports = verifyLoggedIn;