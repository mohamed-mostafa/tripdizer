/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var fs = require("fs");
var dao = require('../dataaccess/hws_grouptrips_dao.js');
var requestBusiness = require('../business/hws_requests_business.js');
var emailBusiness = require('../business/hws_email_business.js');

var register = function (requestData, onSuccess, onFailure) {
	dao.getById(requestData.groupTripId, null, function (groupTrip) {
		if (groupTrip) {
			var request = {
				traveler: {
					name: requestData.name,
					mobile: requestData.phone,
					emailAddress: requestData.email,
					dateOfBirth: "",
				},
				departure_date: groupTrip.departureDate,
				return_date: groupTrip.returnDate,
				flexible_dates: 0,
				leaving_country: 'Cairo',
				itinerary_id: groupTrip.iternaryId,
				first_country: 0,
				second_country: 0,
				third_country: 0,
				travel_purpose: 4,
				number_of_adults: requestData.pex,
				number_of_kids: 0,
				number_of_infants: 0,
				budget_category: 3,
				budget: requestData.pex * parseFloat(groupTrip.totalCost),
				visa_assistance_needed: groupTrip.needsVisa,
				tour_guide_needed: 1,
				specialRequests: requestData.message,
				estimatedCost: requestData.pex * parseFloat(groupTrip.totalCost),
				interests: []
			};
			requestBusiness.placeRequest(request, function (request) {
				const attachmentPromises = [];
				for (let i = 0; i < groupTrip.mailAttachments.length; ++i) {
					attachmentPromises.push(new Promise((resolve, reject) => {
						const attachmentName = groupTrip.mailAttachments[i];
						fs.readFile(`./attachments/${attachmentName}`, function (err, content) {
							if (err) reject(err);
							resolve({
								'filename': attachmentName,
								'content': content
							});
						})
					}));
				}
				Promise.all(attachmentPromises).then(attachments => {
					emailBusiness.sendEmail(request.traveler.emailAddress, "Tripdizer Bookings <bookings@tripdizer.com>", `Tripdizer - ${groupTrip.mailSubject}`, groupTrip.mailBody, attachments);
				}).catch(onFailure);
				// done
				console.log("Changing status of request: " + request.id);
				requestBusiness.changeRequestStatus(request.id, "Group Trip", onSuccess, onFailure);
			}, onFailure, onFailure);
		} else {
			console.log("An error occurred while trying to find a group trip with id " + requestData.groupTripId);
			onFailure("An error occurred while trying to find a group trip with id " + requestData.groupTripId);
		}
	}, onFailure);
};

var create = function (trip, onSuccess, onFailure) {
	const saveFiles = [];
	for (let i = 0; i < trip.mailAttachments.length; ++i) {
		const attachment = trip.mailAttachments[i];
		saveFiles.push(new Promise((resolve, reject) => {
			fs.rename(attachment.path, `./attachments/${attachment.name}`, function (err) {
				if (err) reject(err);
				resolve(attachment.name);
			})
		}));
	}
	Promise.all(saveFiles).then(savedFiles => {
		trip.mailAttachments = savedFiles;
		dao.create(trip, function (groupTrip) {
			onSuccess(groupTrip);
		}, onFailure);
	}).catch(onFailure);
};

var update = function (trip, onSuccess, onFailure) {
	const saveFiles = [];
	for (let i = 0; i < trip.mailAttachments.length; ++i) {
		const attachment = trip.mailAttachments[i];
		saveFiles.push(new Promise((resolve, reject) => {
			fs.rename(attachment.path, `./attachments/${attachment.name}`, function (err) {
				if (err) reject(err);
				resolve(attachment.name);
			})
		}));
	}
	Promise.all(saveFiles).then(savedFiles => {
		trip.mailAttachments = savedFiles;
		dao.update(trip, function (groupTrip) {
			onSuccess(groupTrip);
		}, onFailure);
	}).catch(onFailure);
};

var getAllCurrentTrips = function (lang, onSuccess, onFailure) {
	dao.getAll(lang, groupTrips => onSuccess(groupTrips.filter(gt => !gt.isEnded)), onFailure);
}

exports.register = register;
exports.getById = dao.getById;
exports.create = create;
exports.update = update;
exports.toggle = dao.toggle;
exports.getAll = dao.getAll;
exports.getAllCurrentTrips = getAllCurrentTrips;