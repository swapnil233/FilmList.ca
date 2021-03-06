const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const nodemailer = require("nodemailer");

require("dotenv").config();

// From .env file
const {
    SENDER_EMAIL,
    SENDER_PASSWORD,
    TO_EMAIL
} = process.env;

// smtp transporter
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
    },
});

exports.sendEmailNotification = functions.firestore.document("users/{userId}").onCreate(async (snapshot, context) => {

    const mailOptions = {
        from: `"FilmList.ca" <${SENDER_EMAIL}>`,
        to: `${TO_EMAIL}`,
        subject: `A New User Has Joined FilmList!`,
        text: `A new user has joined FilmList. Name: ${snapshot.data().name}, email: ${snapshot.data().email}`
    };

    try {
        await mailTransport.sendMail(mailOptions);
    } catch (error) {
        functions.logger.error(error);
    }
})