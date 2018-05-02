/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var dao = require('../dataaccess/hws_public_dao.js');

exports.create = dao.create;
exports.update = dao.update;
exports.getVideos = dao.getVideos;