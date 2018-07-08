const jwt = require('jwt-simple');

const user = require('../../business/hws_users_business');
const config = require('../../../config.json');

const getToken = function (headers) {
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

const getDecodedToken = function (headers) {
    try {
        return jwt.decode(getToken(headers), config.SECRET);
    } catch (ex) {
        return null;
    }
};

const isAuthenticated = function (req, res, next) {
    const decodedData = getDecodedToken(req.headers);
    if (decodedData && decodedData.id) {
        user.getUserById(decodedData.id, function (user) {
            if (decodedData.id === user.id && decodedData.username === user.username && decodedData.password === user.password) {
                next();
            } else {
                res.send(401);
            }
        }, function (error) {
            res.send(401);
        })
    } else {
        res.send(401);
    }
};

const isAuthenticatedAsAdmin = function (req, res, next) {
    const decodedData = getDecodedToken(req.headers);
    if (decodedData && decodedData.id) {
        user.getUserById(decodedData.id, function (user) {
            if (decodedData.id === user.id && decodedData.username === user.username && decodedData.password === user.password && user.admin) {
                next();
            } else {
                res.send(401);
            }
        }, function (error) {
            res.send(401);
        })
    } else {
        res.send(401);
    }
};

exports.getToken = getToken;
exports.getDecodedToken = getDecodedToken;
exports.isAuthenticated = isAuthenticated;
exports.isAuthenticatedAsAdmin = isAuthenticatedAsAdmin;