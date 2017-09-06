/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var questionsDao = require('../dataaccess/hws_questions_dao.js');

exports.getAllQuestions = questionsDao.getAllQuestions;
