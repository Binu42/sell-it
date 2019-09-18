// checking for user authentication or not
module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Login Now! Not Authorized');
        res.redirect('/');
    }
}