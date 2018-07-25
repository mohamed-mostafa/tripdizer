const jwt = require('jwt-simple');

const user = require('../../business/hws_users_business');
const config = require('../../../config.json');

const getToken = (headers) => {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split('JWT ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

const getDecodedToken = (headers) => {
    try {
        return jwt.decode(getToken(headers), config.SECRET);
    } catch (ex) {
        return null;
    }
};

const isAuthenticated = (req, res, next) => {
    const decodedData = getDecodedToken(req.headers);
    user.login(decodedData.username, decodedData.password, (user) => {
        next();
    }, () => {
        res.send(401);
    }, () => {
        res.send(401);
    }, () => {
        res.send(401);
    }, false);
};

const isAuthenticatedAsAdmin = (req, res, next) => {
    const decodedData = getDecodedToken(req.headers);
    user.login(decodedData.username, decodedData.password, (user) => {
        if (user.admin) {
            next();
        } else {
            res.send(401);
        }
    }, () => {
        res.send(401);
    }, () => {
        res.send(401);
    }, () => {
        res.send(401);
    }, false);
};

exports.getToken = getToken;
exports.getDecodedToken = getDecodedToken;
exports.isAuthenticated = isAuthenticated;
exports.isAuthenticatedAsAdmin = isAuthenticatedAsAdmin;