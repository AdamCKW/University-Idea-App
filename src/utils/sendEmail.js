import nodemailer from 'nodemailer';
import sendinBlueTransport from 'nodemailer-sendinblue-transport';

export const sendEmail = async (toEmails, subject, text, html) => {
    const transporter = nodemailer.createTransport(
        new sendinBlueTransport({ apiKey: process.env.SENDINBLUE_API_KEY })
    );

    const mailOptions = {
        from: process.env.SENDINBLUE_EMAIL,
        to: toEmails,
        subject: subject,
        text: text,
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log(error);
    }
};
