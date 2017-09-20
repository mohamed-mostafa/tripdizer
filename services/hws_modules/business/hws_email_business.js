/**
 * 
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
	//    host: 'smtp.office365.com',
	host: 'smtp.gmail.com',
	port: 587,
	//    secure: true, // use SSL
	debug: true,
	auth: {
		user: 'bookings@tripdizer.com',
		pass: 'E7gezma3ana'
	}
}));

var sendEmail = function (to, from, subject, body, attachments = []) {
	return new Promise((resolve, reject) => {
		transporter.sendMail({
			from: from,
			to: to,
			subject: subject,
			html: body,
			attachments: attachments
		}, function (error, info) {
			if (error) {
				console.log(error);
				reject({ email: to, done: false, message: error });
			} else {
				console.log('Message sent: ' + info.response);
				resolve({ email: to, done: true, message: info.response });
			}
		});
	})
};

exports.sendEmail = sendEmail;
