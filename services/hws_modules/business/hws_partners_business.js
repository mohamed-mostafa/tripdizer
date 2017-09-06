/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var hwsPartnersDao = require('../dataaccess/hws_partners_dao.js');
var emailBusiness = require('./hws_email_business.js');

var getAllActivePartners = function(onSuccess, onFailure) {
	hwsPartnersDao.getAllPartners(function(partners){
		var activePartners = [];
		for (var i = 0; i < partners.length; i++) {
			if (partners[i].active) {
				activePartners.push(partners[i]);
			}
		}
		onSuccess(activePartners);
	}, onFailure);
};

var notifyPartners = function(travelRequest, onSuccess, onFailure) {
	getAllActivePartners(function (activePartners) {
		
		for (var i = 0; i < activePartners.length; i++) {
			var partner = activePartners[i];
			// prepare email subject, from and to
			var emailSubject = "Tripdizer Travel Request #" + travelRequest.id;
			var to = partner.email;
			
			// prepare email body
			var emailBody = "";
			emailBody += "<html>";
				emailBody += "<h2 style='font-weight: bolder;'>Tripdizer Travel Request #{requestId}</h2>";
				emailBody += "<p style='font-weight: bold;'>Dear {partnerName} team</p>";
				emailBody += "<p>Tripdizer would like to request a travel itinerary satisfying the below criteria:</p>";
				emailBody += "<table style='border-width: 1px; border-color: black; border-style: solid;'>";
					emailBody += "<tr>";
						emailBody += "<td style='font-weight: bolder;border-right-color: black; background-color: grey; color: white;'>";
						emailBody += "Location & Destinations";
						emailBody += "</td>";
						emailBody += "<td>";
						emailBody += "{destinations}";
						emailBody += "</td>";
					emailBody += "</tr>";
					emailBody += "<tr>";
						emailBody += "<td style='font-weight: bolder; border-right-color: black; background-color: grey; color: white;'>";
						emailBody += "Dates";
						emailBody += "</td>";
						emailBody += "<td>";
						emailBody += "{dates}";
						emailBody += "</td>";				
					emailBody += "</tr>";
					emailBody += "<tr>";
						emailBody += "<td style='font-weight: bolder; border-right-color: black; background-color: grey; color: white;'>";
						emailBody += "Purpose & number of travelers";
						emailBody += "</td>";
						emailBody += "<td>";
						emailBody += "{purpose}";
						emailBody += "</td>";
					emailBody += "</tr>";
					emailBody += "<tr>";
						emailBody += "<td style='font-weight: bolder; border-right-color: black; background-color: grey; color: white;'>";
						emailBody += "Budget";
						emailBody += "</td>";
						emailBody += "<td>";
						emailBody += "{budget}";
						emailBody += "</td>";
					emailBody += "</tr>";
					emailBody += "<tr>";
						emailBody += "<td style='font-weight: bolder; border-right-color: black; background-color: grey; color: white;'>";
						emailBody += "Interests";
						emailBody += "</td>";
						emailBody += "<td>";
						emailBody += "{interests}";
						emailBody += "</td>";
					emailBody += "</tr>";
					emailBody += "<tr>";
						emailBody += "<td style='font-weight: bolder; border-right-color: black; background-color: grey; color: white;'>";
						emailBody += "Visa Assistance";
						emailBody += "</td>";
						emailBody += "<td>";
						emailBody += "{visaAssistanceNeeded}";
						emailBody += "</td>";
					emailBody += "</tr>";
					emailBody += "<tr>";
						emailBody += "<td style='font-weight: bolder; border-right-color: black; background-color: grey; color: white;'>";
						emailBody += "Tour Guide";
						emailBody += "</td>";
						emailBody += "<td>";
						emailBody += "{tourGuideNeeded}";
						emailBody += "</td>";
					emailBody += "</tr>";
					emailBody += "<tr>";
						emailBody += "<td style='font-weight: bolder; border-right-color: black; background-color: grey; color: white;'>";
						emailBody += "Additional Customer Requests";
						emailBody += "</td>";
						emailBody += "<td>";
						emailBody += "{additionalRequests}";
						emailBody += "</td>";
					emailBody += "</tr>";
				emailBody += "</table>";
				emailBody += "<p style='font-weight: italic; font-size: 10px; color: red;'>Important! Please don't modify the subject of the email when responding</p>";
				emailBody += "<p style='font-weight: bolder;'>Regards,</p>";
				emailBody += "<p style='font-weight: bold;'>Tripdizer Booking Team</p>";
			emailBody += "</html>";
			
			emailBody = emailBody.replace("{requestId}", travelRequest.id);
			emailBody = emailBody.replace("{partnerName}", partner.name);
			emailBody = emailBody.replace("{destinations}", travelRequest.questionAnswers[0].answer.answer);
			emailBody = emailBody.replace("{dates}", travelRequest.questionAnswers[1].answer.answer);
			emailBody = emailBody.replace("{purpose}", travelRequest.questionAnswers[2].answer.answer);
			emailBody = emailBody.replace("{budget}", travelRequest.questionAnswers[3].answer.answer);
			emailBody = emailBody.replace("{interests}", travelRequest.questionAnswers[4].answer.answer);
			emailBody = emailBody.replace("{visaAssistanceNeeded}", travelRequest.questionAnswers[5].answer.answer);
			emailBody = emailBody.replace("{tourGuideNeeded}", travelRequest.questionAnswers[6].answer.answer);
			emailBody = emailBody.replace("{additionalRequests}", travelRequest.questionAnswers[7].answer.answer);
			
			// notify creation
			emailBusiness.sendEmail(to, "Tripdizer Bookings <bookings@tripdizer.com>", emailSubject, emailBody);
		}
		onSuccess();
	}, onFailure);
};

exports.createNewPartner = hwsPartnersDao.createNewPartner;
exports.updateExistingPartner = hwsPartnersDao.updateExistingPartner;
exports.getAllPartners = hwsPartnersDao.getAllPartners;
exports.getPartnerById = hwsPartnersDao.getPartnerById;
exports.getAllActivePartners = getAllActivePartners;
exports.notifyPartners = notifyPartners;