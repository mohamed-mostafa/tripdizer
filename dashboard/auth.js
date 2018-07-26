// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

// const serverURL = 'http://localhost:8080'; // local backend server
const serverURL = 'https://tripdizer-backend-dot-feisty-parity-188109.appspot.com'; // remote test backend server

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy({
    passReqToCallback: true
}, function (req, username, password, done) { // callback with email and password from our form
    request.post({
        url: `${serverURL}/user/login`,
        form: {
            username: username,
            password: password
        },
    }, (err, response, body) => {
        if (err) return done(err);
        try {
            body = JSON.parse(body);
            if (response.statusCode === 200 && body.user) {
                return done(null, {
                    id: body.user.id,
                    fullName: body.user.fullName,
                    isAdmin: body.user.admin ? true : false,
                    token: body.user.token
                });
            }
        } catch (e) {
            return done(null, false, req.flash('loginMessage', body)); // req.flash is the way to set flashdata using connect-flash
        }
    });
}));

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        redirectToLogin(req, res);
    }
}

const isAuthenticatedAsAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin) {
            next();
        } else {
            renderTo404(req, res);
        }
    } else {
        redirectToLogin(req, res);
    }
}

const redirectToLogin = (req, res) => {
    res.redirect(`/admin/login${req.originalUrl ? `?redirectURL=${encodeURIComponent(req.originalUrl)}`:''}`);
}

const renderTo404 = (req, res) => {
    res.status(404).send(`Cannot GET ${req.originalUrl}`);
}

module.exports = {
    passport: passport,
    isAuthenticated: isAuthenticated,
    isAuthenticatedAsAdmin: isAuthenticatedAsAdmin,
    redirectToLogin: redirectToLogin,
    renderTo404: renderTo404
};