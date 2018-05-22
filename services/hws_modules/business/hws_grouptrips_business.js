/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var fs = require("fs");
var dao = require('../dataaccess/hws_grouptrips_dao.js');
var emailBusiness = require('./hws_email_business.js');


var sendMoroccoMail = function (email, onSuccess, onFailure) {
	fs.readFile("./attachments/MoroccoPackageResponse.html", function (err0, data0) {
		fs.readFile("./attachments/Morocco Group Trip - 24 Nov-01 Dec 2017 - Hezaha W Safer.pdf", function (err1, data1) {
			if (err1) throw err1;
			fs.readFile("./attachments/Morocco Group Trip - 24 Nov-03 Dec 2017 - Hezaha W Safer.pdf", function (err2, data2) {
				if (err2) throw err2;
				emailBusiness.sendEmail(email, "Tripdizer Bookings <bookings@tripdizer.com>", "Hezaha w Safer - Morocco Trip Package", data0, [{
						'filename': "Morocco Group Trip - 24 Nov-01 Dec 2017 - Hezaha W Safer.pdf",
						'content': data1
					}, {
						'filename': "Morocco Group Trip - 24 Nov-03 Dec 2017 - Hezaha W Safer.pdf",
						'content': data2
					}])
					.then(function (response) {
						onSuccess(response)
					})
					.catch(function (response) {
						onFailure(response)
					})
			});
		});
	});
}

var sendCapetownMail = function (email, onSuccess, onFailure) {
	fs.readFile("./attachments/CapeTownPackageResponse.html", function (err0, data0) {
		fs.readFile("./attachments/Cape Town Group Trip Itinerary - 25-31 Jan 2018.pdf", function (err2, data2) {
			if (err2) throw err2;
			emailBusiness.sendEmail(email, "Tripdizer Bookings <bookings@tripdizer.com>", "Hezaha w Safer - Cape Town Trip Package", data0, [{
					'filename': "Cape Town Group Trip Itinerary - 25-31 Jan 2018.pdf",
					'content': data2
				}])
				.then(function (response) {
					onSuccess(response)
				})
				.catch(function (response) {
					onFailure(response)
				})
		});
	});
}

var sendBaliYogaRetreatMail = function (email, onSuccess, onFailure) {
	fs.readFile("./attachments/BaliYogaRetreatPackageResponse.html", function (err0, data0) {
		fs.readFile("./attachments/Bali Yoga and Cultural Retreat 04-11 May 2018.pdf", function (err2, data2) {
			if (err2) throw err2;
			emailBusiness.sendEmail(email, "Tripdizer Bookings <bookings@tripdizer.com>", "Tripdizer - Bali Yoga and Cultural Retreat Trip Package", data0, [{
					'filename': "Bali Yoga & Cultural Retreat 04-11 May 2018.pdf",
					'content': data2
				}])
				.then(function (response) {
					onSuccess(response)
				})
				.catch(function (response) {
					onFailure(response)
				})
		});
	});
}

var getAllCurrentTrips = function (lang, onSuccess, onFailure) {
	dao.getAll(lang, groupTrips => onSuccess(groupTrips.filter(gt => !gt.isEnded)), onFailure);
}

exports.sendMoroccoMail = sendMoroccoMail;
exports.sendCapetownMail = sendCapetownMail;
exports.sendBaliYogaRetreatMail = sendBaliYogaRetreatMail;
exports.getById = dao.getById;
exports.create = dao.create;
exports.toggle = dao.toggle;
exports.getAll = dao.getAll;
exports.getAllCurrentTrips = getAllCurrentTrips;