/**
 * The dataaccess methods of hws
 */
'use strict';

const mysql = require('mysql');
const config = require('../../config.json');

const options = {
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: 'hws'
};

if (config.INSTANCE_CONNECTION_NAME && config.NODE_ENV === 'production') {
  options.socketPath = `/cloudsql/${config.INSTANCE_CONNECTION_NAME}`;
}

// creates a new connection

// var createConnection = function() {
//  	var connection = mysql.createConnection(options);
// 	return connection;
// };

var createConnection = function () {
	var connection = mysql.createConnection({
		host: process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
		port: process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
		user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
		password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'root',
		database: "hws",
		multipleStatements: true
	});
	return connection;
};

exports.createConnection = createConnection;