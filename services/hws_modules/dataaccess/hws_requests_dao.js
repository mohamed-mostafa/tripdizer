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
					request.departure_date = new Date(new Date(request.departure_date).setHours(0, 0, 0, 0));
					request.return_date = new Date(new Date(request.return_date).setHours(0, 0, 0, 0));
					connection.query('INSERT INTO `traveler_request` (`Date`, `Traveler_Email_Address`, `Traveler_Name`, `Traveler_Mobile`, `Traveler_Birth_Date`, `Departure_Date`, `Return_Date`, `Flexible_Dates`, `Leaving_Country`, `First_Country`, `Other_Country`, `Second_Country`, `Third_Country`, `Travel_Purpose`, `Number_Of_Adults`, `Number_Of_Kids`, `Number_Of_Infants`, `Budget_Category`, `Budget`, `Visa_Assistance_Needed`, `Tour_Guide_Needed`, `Itinerary_id`, `Comments`, `Estimated_Cost`, `Referral_Type`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [request.date, request.traveler.emailAddress, request.traveler.name, request.traveler.mobile, request.traveler.dateOfBirth, request.departure_date, request.return_date, request.flexible_dates, request.leaving_country, request.first_country, request.other_country, request.second_country, request.third_country, request.travel_purpose, request.number_of_adults, request.number_of_kids, request.number_of_infants, request.budget_category, request.budget || 0, request.visa_assistance_needed, request.tour_guide_needed, request.itinerary_id, request.specialRequests, request.estimatedCost, request.referralType],
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
								if (request.interests.length > 0) {
									var batchInsertStatement = "INSERT INTO `Traveler_Interests` (`Interest_Id`, `Request_Id`, `Percentage`) VALUES (" + connection.escape(request.interests[0].id) + ", " + request.id + ", " + connection.escape(request.interests[0].percentage) + ")";
									for (var i = 1; i < request.interests.length; ++i) {
										// for each other answer, 
										batchInsertStatement += ", (" + connection.escape(request.interests[i].id) + ", " + request.id + ", " + connection.escape(request.interests[i].percentage) + ")";
									}
									connection.query(batchInsertStatement, function (err, result) {
										// if an error is thrown, end the connection and throw an error
										if (err) { // if the 2nd insert statement fails
											console.log("An error occurred while trying to create the question answers of the requestaa: " + JSON.stringify(request));
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
			var query = 'SELECT tr.*, ti.Interest_Id, ti.Percentage AS Interset_Percentage, u.full_name FROM traveler_request tr LEFT OUTER JOIN user u on tr.Assigned_User = u.id LEFT OUTER JOIN `Traveler_Interests` ti ON tr.Id = ti.Request_Id WHERE tr.Status in (?) ORDER BY tr.Date DESC, ti.Interest_Id';
			connection.query(query, [statuses], function (err, rows) {
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
								id: rows[i].Id,
								date: new Date(rows[i].Date).toString(),
								status: rows[i].Status,
								revenue: rows[i].Revenue,
								profit: rows[i].Profit,
								comments: rows[i].Comments,
								traveler: {
									name: rows[i].Traveler_Name,
									mobile: rows[i].Traveler_Mobile,
									emailAddress: rows[i].Traveler_Email_Address,
									dateOfBirth: new Date(rows[i].Traveler_Birth_Date).toString(),
								},
								userFullName: rows[i].full_name,
								departureDate: new Date(rows[i].Departure_Date).toString(),
								returnDate: new Date(rows[i].Return_Date).toString(),
								flexibleDates: rows[i].Flexible_Dates,
								leavingCountry: rows[i].Leaving_Country,
								firstCountry: rows[i].First_Country,
								otherCountry: rows[i].Other_Country,
								secondCountry: rows[i].Second_Country,
								thirdCountry: rows[i].Third_Country,
								travelPurpose: rows[i].Travel_Purpose,
								numberOfAdults: rows[i].Number_Of_Adults,
								numberOfKids: rows[i].Number_Of_Kids,
								numberOfInfants: rows[i].Number_Of_Infants,
								budgetCategory: rows[i].Budget_Category,
								budget: rows[i].Budget,
								visaAssistanceNeeded: rows[i].Visa_Assistance_Needed,
								tourGuideNeeded: rows[i].Tour_Guide_Needed,
								itineraryId: rows[i].itinerary_id,
								estimatedCost: rows[i].Estimated_Cost,
								edit: rows[i].Edit,
								reachable: rows[i].Reachable,
								packageSent: rows[i].Package_Sent,
								referralType: rows[i].Referral_Type,
								interests: []
							};
							var interest = {
								id: rows[i].Interest_Id,
								percentage: rows[i].Interset_Percentage,
							};

							var requestIndex = -1;
							for (var j = 0; j < requests.length; j++) {
								if (requests[j].id === rows[i].Id) {
									requestIndex = j;
								}
							}
							// requestIndex = requests.findIndex(function (request) { return request.id === rows[i].id; });
							if (requestIndex === -1) {
								request.interests.push(interest);
								requests.push(request);
							} else requests[requestIndex].interests.push(interest);
						}
					}
					connection.end();
					onSuccess(requests);
				}
			});
		}
	});
};


var getRequestSummariesCountByStatus = function (statuses, filter, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			var query = "";
			// if (filter.name) query += " AND Date > '" + filter.name + "'";
			if (filter.from) query += " AND `Date` >= " + connection.escape(filter.from);
			if (filter.to) query += " AND `Date` <= " + connection.escape(filter.to);
			if (filter.departureDateFrom) query += " AND `Departure_Date` >= " + connection.escape(filter.departureDateFrom);
			if (filter.departureDateTo) query += " AND `Departure_Date` <= " + connection.escape(filter.departureDateTo);
			if (filter.destination) query += " AND (`First_Country` = '" + connection.escape(filter.destination) + "' OR `Second_Country` = " + connection.escape(filter.destination) + " OR `Third_Country` = " + connection.escape(filter.destination) + ")";
			// if (filter.status) statuses = [filter.status];
			if (filter.travelPurpose) query += " AND `Travel_Purpose` = " + connection.escape(filter.travelPurpose);
			if (filter.budgetCategory) query += " AND `Budget_Category` = " + connection.escape(filter.budgetCategory);
			if (filter.estimatedFrom) query += " AND `Estimated_Cost` >= " + connection.escape(filter.estimatedFrom);
			if (filter.estimatedTo) query += " AND `Estimated_Cost` <= " + connection.escape(filter.estimatedTo);
			if (filter.edit) query += " AND `Edit` = " + connection.escape(filter.edit);
			if (filter.reachable) query += " AND `Reachable` = " + connection.escape(filter.reachable);
			if (filter.packageSent) query += " AND `Package_Sent` = " + connection.escape(filter.packageSent);
			if (filter.referralType) query += " AND `Referral_Type` = " + connection.escape(filter.referralType);
			// execute the query
			connection.query('SELECT count(id) as count, sum(revenue) as revenue, sum(profit) as profit, sum(Number_Of_Adults + Number_Of_Kids + Number_Of_Infants) as numberOfTravelers FROM traveler_request WHERE status IN (?)' + query, [statuses], function (err, rows) {
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
			connection.query('SELECT tr.*, u.* FROM traveler_request tr LEFT OUTER JOIN user u on tr.Assigned_User = u.id WHERE tr.id = ?', [requestId], function (err, rows) {
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
							id: rows[0].Id,
							date: new Date(rows[0].Date).toString(),
							status: rows[0].Status,
							revenue: rows[0].Revenue,
							profit: rows[0].Profit,
							comments: rows[0].Comments,
							traveler: {
								name: rows[0].Traveler_Name,
								mobile: rows[0].Traveler_Mobile,
								emailAddress: rows[0].Traveler_Email_Address,
								dateOfBirth: new Date(rows[0].Traveler_Birth_Date).toString(),
							},
							userFullName: rows[0].full_name,
							departureDate: new Date(rows[0].Departure_Date).toString(),
							returnDate: new Date(rows[0].Return_Date).toString(),
							flexibleDates: rows[0].Flexible_Dates,
							leavingCountry: rows[0].Leaving_Country,
							firstCountry: rows[0].First_Country,
							otherCountry: rows[0].Other_Country,
							secondCountry: rows[0].Second_Country,
							thirdCountry: rows[0].Third_Country,
							travelPurpose: rows[0].Travel_Purpose,
							numberOfAdults: rows[0].Number_Of_Adults,
							numberOfKids: rows[0].Number_Of_Kids,
							numberOfInfants: rows[0].Number_Of_Infants,
							budgetCategory: rows[0].Budget_Category,
							budget: rows[0].Budget,
							visaAssistanceNeeded: rows[0].Visa_Assistance_Needed,
							tourGuideNeeded: rows[0].Tour_Guide_Needed,
							itineraryId: rows[0].itinerary_id,
							estimatedCost: rows[0].Estimated_Cost,
							edit: rows[0].Edit,
							reachable: rows[0].Reachable,
							packageSent: rows[0].Package_Sent,
							referralType: rows[0].Referral_Type,
							interests: [],
							mailsHistory: [],
						};
						// get the questions answers
						connection.query('SELECT * FROM Traveler_Interests WHERE Request_Id = ? ORDER BY Interest_Id', [requestId], function (itemsErr, itemsRows) {
							// if an error is thrown, end the connection and throw an error
							if (itemsErr) {
								console.log("An error occurred while trying to find the question answers of request with id " + requestId);
								console.log(itemsErr);
								connection.end();
								onFailure(itemsErr);
							} else {

								for (var i = 0; i < itemsRows.length; i++) {
									var interest = {
										id: itemsRows[i].Interest_Id,
										percentage: itemsRows[i].Percentage
									};
									request.interests.push(interest);
								}
								// get mail history
								connection.query('SELECT * FROM traveler_mail_history WHERE Email = ?', [request.traveler.emailAddress], function (mailsErr, mailsRows) {
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
												date: new Date(mailsRows[i].Date).toString()
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
			request.departureDate = new Date(new Date(request.departureDate).setHours(0, 0, 0, 0));
			request.returnDate = new Date(new Date(request.returnDate).setHours(0, 0, 0, 0));
			// execute the query
			connection.query('UPDATE `traveler_request` SET `Status` = ?, `Departure_Date` = ?, `Return_Date` = ?, `Flexible_Dates` = ?, `Leaving_Country` = ?, `First_Country` = ?, `Other_Country` = ?, `Second_Country` = ?, `Third_Country` = ?, `Travel_Purpose` = ?, `Number_Of_Adults` = ?, `Number_Of_Kids` = ?, `Number_Of_Infants` = ?, `Budget_Category` = ?, `Budget` = ?, `Visa_Assistance_Needed` = ?, `Tour_Guide_Needed` = ?, `Itinerary_id` = ?, `Comments` = ?, Revenue = ?, Profit = ?, Edit = ?, Reachable = ?, `Referral_Type` = ? WHERE Id = ?', [request.status, request.departureDate, request.returnDate, request.flexibleDates, request.leavingCountry, request.firstCountry, request.otherCountry, request.secondCountry, request.thirdCountry, request.travelPurpose, request.numberOfAdults, request.numberOfKids, request.numberOfInfants, request.budgetCategory, request.budget || 0, request.visaAssistanceNeeded, request.tourGuideNeeded, request.itineraryId, request.comments || '', request.revenue, request.profit, request.edit, request.reachable, request.referralType, request.id],
				function (err, rows) {
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
			connection.query('UPDATE `traveler_request` SET `Status` = ? WHERE `Id` = ?', [status, orderId], function (err, rows) {
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
			var statement = 'UPDATE traveler_request SET Assigned_User = ' + userId + " WHERE traveler_request.id = " + requestId;
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
					connection.query('INSERT INTO traveler_mail_history (Email, Subject, Attachments) values (?, ?, ?)', [object.email, object.subject, JSON.stringify(attachmentFileNames)], function (err, result) {
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

var getRequestCounts = function (onSuccess, onFailure) {
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
					connection.query('SELECT `s`.`Title` AS `Status`, COUNT(*) AS `Count`, SUM(`tr`.`Number_Of_Adults` + `tr`.`Number_Of_Kids` + `tr`.`Number_Of_Infants`) AS `Total_Travellers`, SUM(`tr`.`Number_Of_Adults`) AS `Adults`, SUM(`tr`.`Number_Of_Kids`) AS `Kids`, SUM(`tr`.`Number_Of_Infants`) AS `Infants` FROM `traveler_request` `tr` JOIN `statuses` `s` ON `tr`.`Status` = `s`.`Id` GROUP BY `tr`.`Status`', function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to get request counts");
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(result);
						}
					});
				}
			});
		}
	});
};

var toggleOptions = function (requestId, option, onSuccess, onFailure) {
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
					connection.query('UPDATE `traveler_request` SET `' + option + '` = `' + option + '` ^ 1 WHERE `Id` = ?', [requestId], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to toggle " + option);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(result);
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
exports.getRequestCounts = getRequestCounts;
exports.toggleOptions = toggleOptions;