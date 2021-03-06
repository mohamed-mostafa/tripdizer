/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var requestsDao = require('../dataaccess/hws_requests_dao.js');
var itinerariesDao = require('../dataaccess/hws_itineraries_dao.js');
// var travelersDao = require('../dataaccess/hws_travelers_dao.js');
var partnersBusiness = require('./hws_partners_business.js');
var emailBusiness = require('./hws_email_business.js');
var Promise = require('promise');
var DateDiff = require('date-diff');
var httpRequest = require('request');


//calls the onSuccess with a user object if the user was successfully created
var placeRequest = function (request, onSuccess, onFailure, onUserError) {
	// insert the request in our database
	request.date = new Date(new Date().setHours(0, 0, 0, 0));
	request.departure_date = new Date(request.departure_date);
	request.return_date = new Date(request.return_date);
	if (!request.budget) request.budget = 0;
	if (request.itinerary_id) {
		request.first_country = 1;
		// delete request.other_country
		delete request.second_country;
		delete request.third_country;
	}

	// travelersDao.getTravelerByEmailAddress(request.traveler.emailAddress, function (traveler) {
	// 	if (traveler == null) { // traveler doesn't exist before, create a traveler first

	// 		travelersDao.createNewTraveler(request.traveler, function (traveler) {

	// 			// create the traveler
	// 			requestsDao.createNewRequest(request, function (request) { // then create the request

	// 				onSuccess(request);

	// 				if (request.traveler.name !== 'Essawy') {
	// 					// notify creation
	// 					emailBusiness.sendEmail("bookings@tripdizer.com", "notifications@tripdizer.com", "Request #" + request.id + " is placed at Tripdizer", request.traveler.name + " has just placed a new request at Tripdizer. Visit the Dashboard to view its details.");
	// 					notifyCustomer(request.traveler.emailAddress, request.traveler.name, request.id);
	// 					partnersBusiness.notifyPartners(request, function () {
	// 						console.log("Notified Partners");
	// 					}, function () {
	// 						console.log("Failed to notify partners");
	// 					});
	// 				}
	// 			}, function (err) {
	// 				// respond to caller
	// 				console.log("An error occured while saving a new request");
	// 				console.log(err);
	// 				onFailure(err);
	// 			});
	// 		}, function (err) {
	// 			console.log("An error occured while creating a new traveler");
	// 			console.log(err);
	// 			onFailure(err);
	// 		});
	// 	} else { // traveler exists before, create the request immediately
	requestsDao.createNewRequest(request, function (request) { // create the request

		onSuccess(request);

		if (request.traveler.name !== 'Essawy') {
			// notify creation
			emailBusiness.sendEmail("bookings@tripdizer.com", "notifications@tripdizer.com", "Request #" + request.id + " is placed at Tripdizer", request.traveler.name + " has just placed a new request at Tripdizer. Visit the Dashboard to view its details.");
			notifyCustomer(request.traveler.emailAddress, request.traveler.name, request.id);
			partnersBusiness.notifyPartners(request, function () {
				console.log("Notified Partners");
			}, function () {
				console.log("Failed to notify partners");
			});
		}
	}, function (err) {
		// respond to caller
		console.log("An error occured while saving a new request");
		console.log(err);
		onFailure(err);
		// });
		// }
	}, function (err) {
		console.log("An error occured while checking if traveler exists before");
		console.log(err);
		onFailure(err);
	});
};

var notifyCustomer = function (to, customerName, requestId) {
	// prepare email body
	var emailBody = "";
	emailBody += "<html>";
	emailBody += "<p style='font-weight: bold;'>Dear {customerName}</p>";
	emailBody += "<p>Thank you for submitting your travel request at Tripdizer. One of our agents will contact you as soon as possible.</p>";
	emailBody += "<p style='font-weight: bolder;'>Regards,</p>";
	emailBody += "<p style='font-weight: bold;'>Tripdizer Booking Team</p>";
	emailBody += "<p style='font-weight: italic; font-size: 8px; color: red;'>Important! Please don't reply to this email</p>";
	emailBody += "</html>";

	emailBody = emailBody.replace("{requestId}", requestId);
	emailBody = emailBody.replace("{customerName}", customerName);

	// notify creation
	emailBusiness.sendEmail(to, "Tripdizer Notifications <do-not-reply@tripdizer.com>", "Your Tripdizer request has been received", emailBody);
};
var sendMailsToRequestTraveler = function (email, onSuccess, onFailure) {
	if (email.type === "traveler") {
		sendMails(email.recipients, email, onSuccess);
	} else if (email.type === "request") {
		requestsDao.getRequestSummariesByStatus(email.recipients, function (travelers) {
			var emails = [];
			for (var i = 0; i < travelers.length; i++)
				emails.push(travelers[i].traveler.emailAddress)
			sendMails(emails, email, onSuccess);
		}, function (err) {
			console.log("An error occured while getting travelers");
			console.log(err);
			onFailure(err);
		});
	}
}

var sendMails = function (emails, email, onSuccess) {
	responses = [];
	for (var i = 0; i < emails.length; ++i)
		responses.push(emailBusiness.sendEmail(emails[i], "notifications@tripdizer.com", email.subject, email.body, email.attachments).then(function (response) {
			return response
		}).catch(function (response) {
			return response
		}));
	Promise.all(responses).then(function (resp) {
		email.response = resp;
		email.count = {
			success: resp.filter(function (item) {
				return item.done
			}).length,
			fail: resp.filter(function (item) {
				return !item.done
			}).length
		};
		onSuccess(email);
	});
}

var budgetCalculation = function (request, onSuccess, onFailure, onUserError) {
	var monthMap = {
		1: "JAN",
		2: "FEB",
		3: "MAR",
		4: "APR",
		5: "MAY",
		6: "JUN",
		7: "JUL",
		8: "AUG",
		9: "SEP",
		10: "OCT",
		11: "NOV",
		12: "DEC"
	};
	if (request.itinerary_id) {
		itinerariesDao.getById(request.itinerary_id, null, function (itinerary) {
				if (itinerary) {
					var diff = new DateDiff(new Date(request.return_date), new Date(request.departure_date));
					const rData = {
						itineraryId: request.itinerary_id,
						iternaryName: itinerary.en_name,
						iternaryArabicName: itinerary.ar_name,
						dailySpendings: itinerary.dailySpendings,
						numberOfAdults: request.number_of_adults,
						numberOfKids: request.number_of_kids,
						numberOfInfants: request.number_of_infants,
						numberOfTravelers: request.number_of_adults + request.number_of_kids + request.number_of_infants,
						numberOfAdultsAndKids: request.number_of_adults + request.number_of_kids,
						departureMonth: monthMap[new Date(request.departure_date).getMonth() + 1],
						returnMonth: monthMap[new Date(request.return_date).getMonth() + 1],
						numberOfRooms: 0,
						totalBudget: 0,
						flightsBudget: 0,
						numberOfNights: Math.abs(diff.days()),
						accomodationBudget: 0,
						ferriesBudget: 0
					};


					for (let i = 0, ferries = itinerary.ferries; i < ferries.length; ++i) {
						rData.ferriesBudget += rData.numberOfAdultsAndKids * (ferries[i][rData.departureMonth] + ferries[i][rData.returnMonth]) / 2;
					}

					for (let i = 0, flights = itinerary.flights; i < flights.length; ++i) {
						rData.flightsBudget += rData.numberOfAdults * (flights[i]['a' + rData.departureMonth] + flights[i]['a' + rData.returnMonth]) / 2;
						rData.flightsBudget += rData.numberOfKids * (flights[i]['k' + rData.departureMonth] + flights[i]['k' + rData.returnMonth]) / 2;
						rData.flightsBudget += rData.numberOfInfants * (flights[i]['i' + rData.departureMonth] + flights[i]['i' + rData.returnMonth]) / 2;
					}

					var hotels = itinerary.hotels.filter(h => h.budget_category_id === request.budget_category);
					for (let i = 0; i < hotels.length; i++) {
						rData.accomodationBudget += rData.numberOfNights * (hotels[i][rData.departureMonth] + hotels[i][rData.returnMonth]) / 2;
					}

					// take the average of the hotels of the same category
					rData.accomodationBudget = hotels.length > 0 ? rData.accomodationBudget / hotels.length : 0;

					// the accomodation budgt is the price per peron for hostels (super economy) or the rate f the room otherwis
					if (request.budget_category == 2) { // super economy
						rData.accomodationBudget = rData.accomodationBudget * rData.numberOfAdultsAndKids;
					} else {
						rData.accomodationBudget = calculateAccomodationBudgetByRoom(rData.accomodationBudget, rData.numberOfAdultsAndKids);
					}

					switch (request.budget_category) {
						// case 2: // Super Economy
						// 	rData.dailySpendings *= 1;
						// 	break;
						// case 3: // Economy
						// 	rData.dailySpendings *= 1;
						// 	break;
						case 4: // Mid Range
							rData.dailySpendings *= 1.5;
							break;
						case 5: // Splurge
							rData.dailySpendings *= 2;
							break;
						default:
							rData.dailySpendings *= 1;
							break;
					}

					// add 10% profit margin
					rData.flightsBudget += (rData.flightsBudget * 0.1);
					rData.ferriesBudget += (rData.ferriesBudget * 0.1);
					rData.accomodationBudget += (rData.accomodationBudget * 0.1);

					rData.totalBudget += rData.ferriesBudget;
					rData.totalBudget += rData.flightsBudget;
					rData.totalBudget += rData.accomodationBudget;

					onSuccess(rData);
				} else {
					console.log("Itinerary Id doesn't exists!.");
					onFailure("Itinerary Id doesn't exists!.");
				}
			},
			function (err) {
				console.log("An error occured while getting itinerary");
				console.log(err);
				onFailure(err);
			});
	} else {
		console.log("Itinerary Id doesn't exists!.");
		onFailure("Itinerary Id doesn't exists!.");
	}
};

var recommendation = function (request, onSuccess, onFailure, onUserError) {
	itinerariesDao.getAllLong(async itineraries => {
		for (let i = 0; i < itineraries.length; i++) {
			itineraries[i].rank = 0;
			const budgetCalculation = await recommendationFuncs.budget(request, itineraries[i].id, itineraries[i].budgetCategories);
			itineraries[i].estimatedCost = budgetCalculation.totalBudget;
			itineraries[i].recommendationRanks = {
				budget: budgetCalculation.rank,
				purpose: recommendationFuncs.purpose(request.travel_purpose, itineraries[i].purposes),
				season: recommendationFuncs.season(request.departure_date, request.return_date, itineraries[i].seasons),
				interest: recommendationFuncs.interest(request.interests, itineraries[i].interests),
				needsVisa: recommendationFuncs.needsVisa(request.visa_assistance_needed, itineraries[i].needsVisa),
			}
			for (const rank in itineraries[i].recommendationRanks) {
				if (itineraries[i].recommendationRanks.hasOwnProperty(rank)) {
					itineraries[i].rank += itineraries[i].recommendationRanks[rank];
				}
			}
			itineraries[i].rank = itineraries[i].rank / Object.keys(itineraries[i].recommendationRanks).length;
		}
		onSuccess(itineraries.filter(i => i.id !== -1).sort((a, b) => a.rank - a.rank).map(i => ({
			id: i.id,
			enName: i.en_name,
			enDescription: i.en_description,
			arName: i.ar_name,
			arDescription: i.ar_description,
			image1: i.image1,
			estimatedCost: i.estimatedCost,
			recommendationRanks: i.recommendationRanks,
			rank: i.rank
		})));
	}, onFailure);
};

var recommendationFuncs = {
	season: (requestDepartureDate, requestReturnDate, seasons) => {
		requestDepartureDate = new Date(requestDepartureDate);
		requestReturnDate = new Date(requestReturnDate);
		for (let i = 0; i < seasons.length; i++) {
			const start = new Date(seasons[i].start),
				end = new Date(seasons[i].end);
			if ((requestDepartureDate > start && requestDepartureDate < end) || (requestReturnDate > start && requestReturnDate < end))
				return seasons[i].type == 0 ? 100 : seasons[i].type == 2 ? 50 : 0;
		}
		return 0;
	},
	budget: async (request, itineraryId, budgetCategories) => await new Promise((resolve, reject) => {
		budgetCalculation({ ...request,
			itinerary_id: itineraryId
		}, function (calculation) {
			const requestBudgetCategory = request.budget_category;
			if (requestBudgetCategory == 1) {
				if (parseFloat(calculation.totalBudget) < parseFloat(request.budget)) calculation.rank = 100;
				else calculation.rank = 0;
			} else {
				for (let i = 0; i < budgetCategories.length; i++)
					if (budgetCategories[i].budget_category_Id == requestBudgetCategory)
						calculation.rank = budgetCategories[i].Percentage
			}
			resolve(calculation);
		}, reject, reject);
	}),
	purpose: (requestPurpose, purposes) => { // What if the purpose is "other"?
		for (let i = 0; i < purposes.length; i++)
			if (purposes[i].travel_purpose_Id == requestPurpose)
				return purposes[i].Percentage;
		return 0;
	},
	interest: (requestInterests, itineraryInterests) => {
		let sumOfInterests = 0;
		for (let i = 0; i < requestInterests.length; i++) {
			itineraryInterest = itineraryInterests.find(ii => ii.interests_Id == requestInterests[i].id);
			if (itineraryInterest) {
				sumOfInterests += requestInterests[i].percentage * itineraryInterest.Percentage / 100;
			}
		}
		return sumOfInterests / requestInterests.length;
	},
	needsVisa: (request, itinerary) => {
		request = request ? 1 : 0;
		itinerary = itinerary ? 1 : 0;
		return request === itinerary ? 100 : 0;
	}
};

var calculateAccomodationBudgetByRoom = function (costOfAllNights, numbrtOfTravelers) {
	var regularRooms = Math.floor(numbrtOfTravelers / 2);
	var extraRooms = numbrtOfTravelers % 2;

	var cost = costOfAllNights;
	if (extraRooms == 0) { // regular rooms is 2, 4, 6, ... etc
		cost = costOfAllNights * regularRooms;
	} else {
		if (regularRooms == 0) { // number of adults = 1
			cost = costOfAllNights;
		} else { // number of adults = 3, 5, ... etc
			cost = (costOfAllNights * (regularRooms - 1)) + (costOfAllNights * 1.35 * extraRooms);
		}
	}

	return cost;
}

var sendDailyReportOfRequestsCount = function () {
	requestsDao.getRequestCounts(function (counts) {
		// prepare email body
		var emailBody = "";
		emailBody += "<html><head><style>table{border-collapse:collapse;width:100%}th,td{padding:8px 30px 8px 10px;text-align:left;border-bottom:1px solid #ddd}tr:hover{background-color:#f5f5f5}tr:nth-child(even){background-color:#f2f2f2}thead td{background-color:#3c8dbc;color:#fff}</style></head>";
		emailBody += "<p style='font-weight: bold;'>Dear Team,</p>";
		emailBody += "<p>Current State:</p>";
		emailBody += "<table><thead><tr><td>Status<td><td>Count<td><td>Total Travellers<td><td>Adults<td><td>Kids<td><td>Infants<td></tr></thead>";
		for (let i = 0; i < counts.length; ++i) {
			emailBody += '<tr>';
			emailBody += `<td>${counts[i].Status}<td>`;
			emailBody += `<td>${counts[i].Count}<td>`;
			emailBody += `<td>${counts[i].Total_Travellers}<td>`;
			emailBody += `<td>${counts[i].Adults}<td>`;
			emailBody += `<td>${counts[i].Kids}<td>`;
			emailBody += `<td>${counts[i].Infants}<td>`;
			emailBody += '</tr>';
		}
		emailBody += "</table>";
		emailBody += "</table><p style='font-weight: bolder;'>Regards,</p>";
		emailBody += "<p style='font-weight: bold;'>Tripdizer Notifications</p>";
		emailBody += "<p style='font-weight: italic; font-size: 8px; color: red;'>Important! Please don't reply to this email</p>";
		emailBody += "</html>";

		// notify creation
		emailBusiness.sendEmail("bookings@tripdizer.com", "Tripdizer Notifications <notifications@tripdizer.com>", "Tripdizer daily requests report", emailBody);
	}, function () {
		console.log("An error occured while getting request counts");
	})
}

var getPackage = function (requestId, onSuccess, onFailure) {
	requestsDao.getRequestById(requestId, function (request) {
			const departureDate = new Date(request.departureDate);
			const returnDate = new Date(request.returnDate);
			const tripDays = Math.ceil(Math.abs(returnDate.getTime() - departureDate.getTime()) / (1000 * 3600 * 24));
			if (request.itineraryId) {
				itinerariesDao.getById(request.itineraryId, null, async function (itinerary) {
						if (itinerary.flights.length > 0) {
							itinerary.flights = itinerary.flights.sort((a, b) => a.type - b.type);
							itinerary.flights[0].date = departureDate.toLocaleDateString();
							for (let i = itinerary.flights.length - 1; i >= 0; i--)
								if (itinerary.flights[i].return)
									itinerary.flights.push({
										type: itinerary.flights[i].type,
										arriving_to: itinerary.flights[i].departing_from,
										departing_from: itinerary.flights[i].arriving_to,
										departure_time: itinerary.flights[i].return_departure_time,
										arrival_time: itinerary.flights[i].return_arrival_time,
										lay_over: itinerary.flights[i].return_lay_over,
										Iternary_id: itinerary.flights[i].Iternary_id
									});
						}
						itinerary.countries = itinerary.countries.sort((a, b) => a.order - b.order);
						for (let i = 0; i < itinerary.countries.length; ++i) {
							itinerary.countries[i].numberOfDays = tripDays * itinerary.countries[i].days / 100;
							itinerary.countries[i].startDate = i === 0 ? departureDate : new Date(new Date(itinerary.countries[i - 1].endDate).setDate(itinerary.countries[i - 1].endDate.getDate()));
							itinerary.countries[i].endDate = new Date(new Date(itinerary.countries[i].startDate).setDate(itinerary.countries[i].startDate.getDate() + itinerary.countries[i].numberOfDays));
							if (itinerary.flights[i + 1]) itinerary.flights[i + 1].date = itinerary.countries[i].endDate.toLocaleDateString();
						}
						itinerary.hotels = itinerary.hotels.filter(h => h.budget_category_id === request.budgetCategory);
						for (let i = 0; i < itinerary.hotels.length; ++i) {
							const country = itinerary.countries.find(c => c.id == itinerary.hotels[i].Country_Id);
							if (country) {
								itinerary.hotels[i].order = country.order;
								itinerary.hotels[i].checkIn = country.startDate.toLocaleDateString();
								itinerary.hotels[i].checkOut = country.endDate.toLocaleDateString();
								itinerary.hotels[i].nights = country.numberOfDays;
							}
						}
						request = {
							id: request.id,
							travelerName: request.traveler.name ? request.traveler.name : "",
							estimatedCost: request.estimatedCost ? currencyFormat(request.estimatedCost) : currencyFormat(0),
							itinerary: {
								name: itinerary.en_name ? itinerary.en_name : "",
								introduction: itinerary.introduction ? itinerary.introduction : "Introduction",
								includes: itinerary.includes ? itinerary.includes : "",
								excludes: itinerary.excludes ? itinerary.excludes : "",
								image1: itinerary.image1 && await isValidImage(itinerary.image1) ? itinerary.image1 : "https://i.imgur.com/LsHCFiD.jpg",
								flights: itinerary.flights.map(rf => ({
									date: rf.date ? rf.date : "",
									departingFrom: rf.departing_from ? rf.departing_from : "",
									arrivingTo: rf.arriving_to ? rf.arriving_to : "",
									departureTime: rf.departure_time ? rf.departure_time : "",
									arrivalTime: rf.arrival_time ? rf.arrival_time : "",
									layOver: rf.lay_over ? rf.lay_over : ""
								})),
								hotels: itinerary.hotels.sort((a, b) => a.order - b.order).map(rh => ({
									countryName: rh.Country_Name ? rh.Country_Name : "",
									checkIn: rh.checkIn ? rh.checkIn : "",
									checkOut: rh.checkOut ? rh.checkOut : "",
									nights: rh.nights ? rh.nights : "",
									name: rh.EN_Name ? rh.EN_Name : ""
								}))
							}
						};
						httpRequest.post({
							url: 'https://script.google.com/macros/s/AKfycbwQdxYAZ8X3qi6p8wtWHwlO1v-SYAfYvk83kmCb-mEZ5jfLzRB8/exec',
							form: JSON.stringify(request),
							followAllRedirects: true,
							headers: {
								'Content-Type': 'text/plain',
							}
						}, function (error, response, body) {
							if (response.statusCode === 200 && isUrl(body)) {
								onSuccess(body);
							} else {
								const errorBody = body.match(/<body(?:.*?)>([^<].*?)<\/.*>/);
								if (errorBody[1]) {
									console.log("An error occured while getting request package: " + errorBody[1]);
									onFailure("An error occured while getting request package: " + errorBody[1]);
								} else {
									console.log("An error occured while getting request package: " + error);
									onFailure("An error occured while getting request package: " + error);
								}
							}
						});
					},
					function (err) {
						console.log("An error occured while getting request package");
						console.log(err);
						onFailure(err);
					})
			} else {
				onFailure("Itinerary Id doesn't exists!.");
			}
		},
		function (err) {
			console.log("An error occured while getting request package");
			console.log(err);
			onFailure(err);
		})
}

function currencyFormat(value) {
	var r = new RegExp(1..toLocaleString().replace(/^1/, "").replace(/\./, "\\.") + "$");
	return (~~value).toLocaleString().replace(r, "") + (value % 1).toFixed(2).toLocaleString().replace(/^[+-]?0+/, "")
}

async function isValidImage(url) {
	return await new Promise(resolve => {
		httpRequest(url, function (error, response, body) {
			if (!error && response.statusCode == 200 && (response.headers['content-type']).match(/(image)+\//g)) {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	})
}

function isUrl(str) {
	regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
	if (regexp.test(str)) return true;
	else return false;
}

exports.placeRequest = placeRequest;
exports.getRequestById = requestsDao.getRequestById;
exports.assignRequestToUser = requestsDao.assignRequestToUser;
exports.updateRequest = requestsDao.updateRequest;

exports.getRequestSummaries = requestsDao.getRequestSummariesByStatus;
exports.getRequestSummariesCount = requestsDao.getRequestSummariesCountByStatus;
exports.sendMailsToRequestTraveler = sendMailsToRequestTraveler
exports.recommendation = recommendation;
exports.changeRequestStatus = requestsDao.modifyRequestStatusById;
exports.budgetCalculation = budgetCalculation;
exports.sendDailyReportOfRequestsCount = sendDailyReportOfRequestsCount;
exports.toggleOptions = requestsDao.toggleOptions;
exports.getPackage = getPackage;