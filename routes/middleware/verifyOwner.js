function verifyOwner(req, res, next) {
	// Check that there is no session or that there is no user in the session.
    if (req.session.user.type == 'owner') {
        console.log("User is an owner");
        next();
    } else {
        console.log("User is not an owner");
        next();
    }
}

module.exports = verifyOwner;