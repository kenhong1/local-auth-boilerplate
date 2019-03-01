// Middleware to verify that a user is autheticated


module.exports = function(req, res, next){
    if (!req.user) {
        req.flash("error", "you must be logged in to access that page")
        res.redirect("/auth/login")
    } else {
        next(); 
    }
};