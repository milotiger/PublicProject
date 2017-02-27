"use strict";

var nodemailer = require('nodemailer');

module.exports = {
    sendMail: (to, subject, text, done) => {
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: "masdoc.company@gmail.com",
                pass: "Masdoc!@#123"
            },
            tls: {
                rejectUnauthorized: false
            }
        };

        var transporter = nodemailer.createTransport(smtpConfig);

        var mailOptions = {
            from: 'MTae CEO MASDOC <masdoc.company@gmail.com>',
            to : to,
            subject: subject,
            text : text
        };

        transporter.sendMail(mailOptions, function(error, info) {
            done(error);
        });
    }
};
