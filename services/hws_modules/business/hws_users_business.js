/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var hwsUsersDao = require('../dataaccess/hws_users_dao.js');

// calls the onSuccess with a user object if the user exists
// calls onUserNotFound without parameters if the username doesn't exist
// calls the onIncorrectPassword without parameters if the password is not correct
// calls the onFailure with an error object if technical error occurs
var login = function(username, password, onSuccess, onUserNotFound, onIncorrectPassword, onFailure) {
	hwsUsersDao.getUserByUsername(username, function(user) {
		if (user == null) {
			onUserNotFound();
		} else if (password === user.password) { // compare the passwords 
			onSuccess(user);
		} else {
			onIncorrectPassword();
		}
	}, onFailure);
};


var getAllActiveUsers = function(onSuccess, onFailure) {
	g2gUsersDao.getAllUsers(function(users){
		var activeUsers = [];
		for (var i = 0; i < users.length; i++) {
			if (user[i].active) {
				activeUsers.push(users[i]);
			}
		}
		onSuccess(activeUsers);
	}, onFailure);
};

exports.login = login;
exports.registerNewUser = hwsUsersDao.createNewUser;
exports.updateExistingUser = hwsUsersDao.updateExistingUser;
exports.getAllUsers = hwsUsersDao.getAllUsers;
exports.getUserById = hwsUsersDao.getUserById;
exports.getAllActiveUsers = getAllActiveUsers;
