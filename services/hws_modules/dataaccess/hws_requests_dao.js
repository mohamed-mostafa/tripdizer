/**
 * The dataaccess methods of hws
 */

var daoUtilities = require("./hws_dao_utilities.js");

var createNewRequest = function (request, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the request
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO hws.traveler_request (request_date, traveler_email_address) values (?, ?)',
						[request.date, request.traveler.emailAddress],
						function (err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) { // if the first insert statement fails
								console.log("An error occurred while trying to create the new request: " + JSON.stringify(request));
								console.log(err);
								connection.rollback(); // rollback the transaction
								// end the connection
								connection.end();
								onFailure(err);
							} else {
								// set the id to the order
								request.id = result.insertId;
								// insert the answers
								if (request.questionAnswers.length > 0) {
									var batchInsertStatement = "INSERT INTO hws.traveler_question_answer (traveler_request_id, question_id, answer) values (" + request.id + ", " + connection.escape(request.questionAnswers[0].question.id) + ", " + connection.escape(request.questionAnswers[0].answer.answer) + ")";
									for (var i = 1; i < request.questionAnswers.length; i++) {
										// for each other answer, 
										batchInsertStatement += ", (" + request.id + ", " + connection.escape(request.questionAnswers[i].question.id) + ", " + connection.escape(request.questionAnswers[i].answer.answer) + ")";
									}
									connection.query(batchInsertStatement, function (err, result) {
										// if an error is thrown, end the connection and throw an error
										if (err) { // if the 2nd insert statement fails
											console.log("An error occurred while trying to create the question answers of the request: " + JSON.stringify(request));
											console.log(err);
											connection.rollback();
											// end the connection
											connection.end();
											onFailure(err);
										} else {
											// end the connection
											connection.commit();
											connection.end();
											// call the callback function provided by the caller, and give it the response
											onSuccess(request);
										}
									});
								} else { // no answers to insert
									// end the connection
									connection.commit();
									connection.end();
									// call the callback function provided by the caller, and give it the request object
									onSuccess(request);
								}
							}
						});
				}
			});
		}
	});
};

var getRequestSummariesByStatus = function (statuses, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT tr.*, t.*, u.full_name FROM hws.traveler_request tr JOIN hws.traveler t on t.email_address = tr.traveler_email_address LEFT OUTER JOIN hws.user u on tr.assigned_user_id = u.id WHERE tr.status in (?) ORDER BY tr.request_date DESC ', [statuses], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					console.log("An error occurred while trying to find requests with statuses " + statuses);
					console.log(err);
					connection.end();
					onFailure(err);
				} else {
					// no error is thrown
					var requests = [];
					if (rows.length != 0) {
						// populate the user attributes
						for (var i = 0; i < rows.length; i++) {
							var request = {
								id: rows[i].id,
								status: rows[i].status,
								date: rows[i].request_date,
								revenue: rows[i].revenue,
								profit: rows[i].profit,
								comments: rows[i].comments,
								userFullName: rows[i].full_name,
								traveler: {
									name: rows[i].name,
									mobile: rows[i].mobile,
									emailAddress: rows[i].email_address,
									dateOfBirth: rows[i].date_of_birth,
								},
								questionAnswers: []
							};
							requests.push(request);
						}
					}
					connection.end();
					onSuccess(requests);
				}
			});
		}
	});
};


var getRequestSummariesCountByStatus = function (statuses, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT count(id) as count, sum(revenue) as revenue, sum(profit) as profit FROM hws.traveler_request WHERE status IN (?)', [statuses], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					console.log("An error occurred while trying to count order summaries with statuses " + statuses);
					console.log(err);
					connection.end();
					onFailure(err);
				} else {
					// no error is thrown
					connection.end();
					onSuccess(rows[0]);
				}
			});
		}
	});
};

var getRequestById = function (requestId, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT tr.*, t.*, u.* FROM hws.traveler_request tr JOIN hws.traveler t on t.email_address = tr.traveler_email_address LEFT OUTER JOIN hws.user u on tr.assigned_user_id = u.id WHERE tr.id = ?', [requestId], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					console.log("An error occurred while trying to find a request with id " + requestId);
					console.log(err);
					connection.end();
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						var request = {
							id: requestId,
							status: rows[0].status,
							date: rows[0].request_date,
							revenue: rows[0].revenue,
							profit: rows[0].profit,
							comments: rows[0].comments,
							userFullName: rows[0].full_name,
							traveler: {
								name: rows[0].name,
								mobile: rows[0].mobile,
								emailAddress: rows[0].email_address,
								dateOfBirth: rows[0].date_of_birth,
							},
							questionAnswers: [],
							mailsHistory: []
						};
						// get the questions answers
						connection.query('SELECT * FROM hws.traveler_question_answer JOIN hws.question ON id = question_id WHERE traveler_request_id = ?', [requestId], function (itemsErr, itemsRows) {
							// if an error is thrown, end the connection and throw an error
							if (itemsErr) {
								console.log("An error occurred while trying to find the question answers of request with id " + requestId);
								console.log(itemsErr);
								connection.end();
								onFailure(itemsErr);
							} else {

								for (var i = 0; i < itemsRows.length; i++) {
									var questionAnswer = {
										question: {
											text: itemsRows[i].text,
										},
										answer: {
											answer: itemsRows[i].answer,
										}
									};
									request.questionAnswers.push(questionAnswer);
								}
								// get mail history
								connection.query('SELECT * FROM hws.traveler_mail_history WHERE Email = ?', [request.traveler.emailAddress], function (mailsErr, mailsRows) {
									// if an error is thrown, end the connection and throw an error
									if (itemsErr) {
										console.log("An error occurred while trying to find the question answers of request with id " + requestId);
										console.log(mailsErr);
										connection.end();
										onFailure(mailsErr);
									} else {
										for (var i = 0; i < mailsRows.length; i++) {
											var mailHistory = {
												subject: mailsRows[i].Subject,
												attachments: JSON.parse(mailsRows[i].Attachments),
												date: mailsRows[i].Date
											};
											request.mailsHistory.push(mailHistory);
										}
										connection.end();
										onSuccess(request);
									}
								});
							}
						});
					} else {
						connection.end();
						onSuccess(null);
					}
				}
			});
		}
	});
};

//calls the onSuccess
//calls the onFailure with an err object in case of technical error
var updateRequest = function (request, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			var statement = 'UPDATE hws.traveler_request SET comments = ' + connection.escape(request.comments);
			statement += ', revenue = ' + request.revenue;
			statement += ', profit = ' + request.profit;
			statement += ' WHERE id = ?';
			connection.query(statement, [request.id], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				//				connection.end();
				if (err) {
					console.log("An error occurred while trying to set a comment to a request with id " + request.id);
					console.log(err);
					connection.rollback();
					connection.end();
					onFailure(err);
				} else {
					// no error is thrown
					connection.commit();
					connection.end();
					onSuccess();
				}
			});
		}
	});
};

//calls the onSuccess
//calls the onFailure with an err object in case of technical error
var modifyRequestStatusById = function (orderId, status, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			var statement = 'UPDATE hws.traveler_request SET status = ' + connection.escape(status);

			statement += ' WHERE id = ?';
			connection.query(statement, [orderId], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				//				connection.end();
				if (err) {
					console.log("An error occurred while trying to update a request with id " + orderId);
					console.log(err);
					connection.rollback();
					connection.end();
					onFailure(err);
				} else {
					// no error is thrown
					connection.commit();
					connection.end();
					onSuccess();
				}
			});
		}
	});
};

//calls the onSuccess
//calls the onFailure with an err object in case of technical error
var assignRequestToUser = function (requestId, userId, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			var statement = 'UPDATE hws.traveler_request SET assigned_user_id = ' + userId + " WHERE hws.traveler_request.id = " + requestId;
			connection.query(statement, [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				//				connection.end();
				if (err) {
					console.log("An error occurred while trying to assign a user to a request with id " + requestId);
					console.log(err);
					connection.rollback();
					connection.end();
					onFailure(err);
				} else {
					// no error is thrown
					connection.commit();
					connection.end();
					onSuccess();
				}
			});
		}
	});
};


var addNewMailHistory = function (object, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the mail history
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					var attachmentFileNames = [];
					object.attachments.forEach(function (attachment) {
						attachmentFileNames.push(attachment.filename);
					});
					connection.query('INSERT INTO hws.traveler_mail_history (Email, Subject, Attachments) values (?, ?, ?)', [object.email, object.subject, JSON.stringify(attachmentFileNames)], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to add new mail history " + object.email);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(object);
						}
					});
				}
			});
		}
	});
};

exports.assignRequestToUser = assignRequestToUser;
exports.updateRequest = updateRequest;
exports.createNewRequest = createNewRequest;
exports.getRequestSummariesByStatus = getRequestSummariesByStatus;
exports.getRequestSummariesCountByStatus = getRequestSummariesCountByStatus;
exports.modifyRequestStatusById = modifyRequestStatusById;
exports.getRequestById = getRequestById;
exports.addNewMailHistory = addNewMailHistory;