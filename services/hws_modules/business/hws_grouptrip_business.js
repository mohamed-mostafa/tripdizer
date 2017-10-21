/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var fs = require("fs");
var emailBusiness = require('./hws_email_business.js');

var sendMail = function (email, onSuccess, onFailure) {
	fs.readFile("./hws_modules/business/attachment.txt", function (err, data) {
		if (err) throw err
		emailBusiness.sendEmail(email, "Tripdizer Bookings <bookings@tripdizer.com>", "subject", "body", [{ 'filename': "attachment.txt", 'content': data }])
			.then(function(response) { onSuccess(response)})
			.catch(function(response) {onFailure(response)})
	});
}

exports.sendMail = sendMail;