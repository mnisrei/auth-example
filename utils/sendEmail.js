const nodemailer = require("nodemailer");

const sendMails = ({ to, subject, text })=>{

    console.log("Send Mail called", to);
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVICE,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        html: text,
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Options", to);
            console.log(info);
        }
    });
};

module.exports = sendMails