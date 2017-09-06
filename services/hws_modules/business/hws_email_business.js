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

var sendEmail = function(to, from, subject, body) {
	transporter.sendMail({
	    from: from,
	    to: to,
	    subject: subject,
	    html: body
	}, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
    }});
};

exports.sendEmail = sendEmail;
