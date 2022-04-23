const express = require("express");
const nodemailer = require("nodemailer")
const dotenv = require("dotenv");

const app = express();

dotenv.config();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.status(200).json({
		data: `Welcome to Saharsh Patel Portfolio! Feel free to visit my site on ${process.env.FRONTEND_BASE_URL}`
	});
});

app.post("/send", (req, res) => {
	const formData = req.body;
	const transporter = nodemailer.createTransport({
		service: process.env.TRANSPORT_SERVICE,
		auth: {
			user: process.env.GALAXYSTAFFING_TO_EMAIL,
			pass: process.env.MYPASSWORD
		}
	});

	const mailOptions = {
		from: process.env.GALAXYSTAFFING_TO_EMAIL,
		to: process.env.GALAXYSTAFFING_TO_EMAIL,
		subject: formData.subject,
		text: getFormattedString(formData.firstname, formData.lastname, formData.message, formData.email, formData.hiring)
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
			return res.status(500).json({ error });
		} else {
			console.log('Email sent ' + info.response);
		}
	});

	res.status(200).json({ sent: true });
});

app.use((req, res) => {
	res.status(404).send("404 page not found");
});

function getFormattedString(firstname, lastname, message, email, hiring) {
	return `
		Hi Saharsh,
			Someone from your website has sent you a message. Here are their information. Please get it touch as soon as possible.
			Name: ${lastname} ${firstname},
			Email: ${email},
			Message: 
			${message},
			IsHiring: ${hiring},
	`;
}

app.listen(HTTP_PORT, () => console.log(`Express http server listening on: ${HTTP_PORT}`));
