function verifyCustomer(req, res, next) {
	// Check that there is no session or that there is no user in the session.
    if (req.session.user.type == 'customer') {
        console.log("User is a customer");
        next();
    } else {
        console.log("User is not a customer");
        next();
    }
}

module.exports = verifyCustomer;