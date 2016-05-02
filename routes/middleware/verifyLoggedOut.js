function verifyLoggedOut(req, res, next) {
	// Check that the session contains a user.
    if (req.session && req.session.user) {
    	// User is logged in, redirect to home page.
        res.redirect('/home/');
    } else {
    	// User is logged out, continue with the request.
        next();
    }
}

module.exports = verifyLoggedOut;