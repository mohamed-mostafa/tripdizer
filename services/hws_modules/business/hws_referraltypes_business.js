/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var dao = require('../dataaccess/hws_referraltypes_dao.js');

exports.getById = dao.getById;
exports.create = dao.create;
exports.update = dao.update;
exports.getAll = dao.getAll;