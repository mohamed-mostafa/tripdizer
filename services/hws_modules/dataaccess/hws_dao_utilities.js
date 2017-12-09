/**
 * The dataaccess methods of hws
 */
'use strict';

const mysql = require('mysql');
const config = require('../../config');
const connection = null;

creates a new connection
var createConnection = function() {
// 	var connection = mysql.createConnection({
// 	host     : process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
// 	port     : process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
// 	user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
// 	password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'root',
// 	database: "hws"
// 	});
// 	return connection;
if (connection) return connection;

const options = {
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: 'hws'
};

if (config.get('INSTANCE_CONNECTION_NAME') && config.get('NODE_ENV') === 'production') {
  options.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`;
}

connection = mysql.createConnection(options);
return connection;

};

exports.createConnection = createConnection;