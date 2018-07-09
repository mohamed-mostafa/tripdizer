var hwsUsersBusiness = require('../business/hws_users_business.js');

var loginUser = function(req, res) {	
	try {
		// call the business function and give it a callback function 
		var username = req.body.username;
		var password = req.body.password;
		hwsUsersBusiness.login(username, password,
				function(user) {
			res.json({user: user});
		},
		function(){
			res.status(401).send("Login failed. Are you sure you're using a valid Tripdizer credentials ?");
		},
		function(){
			res.status(401).send("Login failed. Are you sure you're using a valid Tripdizer credentials ?");
		},
		function(err) {
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /users/login");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var updateUser = function(req, res) {	
	try {
		// call the business function and give it a callback function 
		var user = req.body.user;
		hwsUsersBusiness.updateExistingUser(user, function(user) {
			res.json(user);
		}, function(error){
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		}, function(businessError) {
			res.status(500).send(businessError);
		});
	} catch (error) {
		console.log("An error occured in /user");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var createUser = function(req, res) {	
	try {
		// call the business function and give it a callback function 
		var user = req.body.user;
		hwsUsersBusiness.registerNewUser(user, function(user) {
			res.json(user);
		},
		function(error){
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /users");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAllUsers = function(req, res) {	
	try {
		// call the business function and give it a callback function 
		hwsUsersBusiness.getAllUsers(function(users) {
			res.json(users);
		},
		function(error){
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /users");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAllUsersToAssign = function(req, res) {	
	try {
		// call the business function and give it a callback function 
		hwsUsersBusiness.getAllUsersToAssign(function(users) {
			res.json(users);
		},
		function(error){
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /users/ToAssign");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAllActiveUsers = function(req, res) {	
	try {
		// call the business function and give it a callback function 
		hwsUsersBusiness.getAllActiveUsers(function(users) {
			res.json(users);
		},
		function(error){
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /users/active");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};


exports.loginUser = loginUser;
exports.updateUser = updateUser;
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getAllUsersToAssign = getAllUsersToAssign;
exports.getAllActiveUsers = getAllActiveUsers;