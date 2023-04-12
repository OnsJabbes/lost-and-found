const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');














// Load User model
const User = require('../models/User');

const { JsonWebTokenError } = require('jsonwebtoken');
const { token } = require('morgan');

router.use(express.json());

// Login Page
router.get('/login', (req, res) => res.render('login.html'));

// Register Page
router.get('/register', (req, res) => res.render('login.html'));

//mail sender details 
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'onsjabes@gmail.com',
		pass: 'jgnrmcdpdpkcdgwm'
	},
	tls: {
		rejectUnauthorized: false
	}
})

// Register
router.post('/register', (req, res) => {
	const { name, email, password, password2 } = req.body;
	const characters = "0123456789";
	let activationCode = "";
	for (let i = 0; i < 4; i++) {
		activationCode += characters[Math.floor(Math.random() * characters.length)];
	}

	let errors = [];

	if (!name || !email || !password || !password2) {
		errors.push({ msg: 'Please enter all fields' });
	}

	if (password != password2) {
		errors.push({ msg: 'Passwords do not match' });
	}

	if (password.length < 6) {
		errors.push({ msg: 'Passwords must be at least 6 characters' });
	}

	if (errors.length > 0) {
		res.render('login.html', {
			errors,
			name,
			email,
			password,
			password2,

		});
	} else {
		User.findOne({ email: email }).then(user => {
			if (user) {
				errors.push({ msg: 'Email already exists' });
				res.render('login.html', {
					errors,
					name,
					email,
					password,
					password2,

				});
			} else {
				const newUser = new User({

					name,
					email,
					password,
					activationCode,
					isActive: false,
					expiresAt: Date.now() + 60000, //1 minute 

				})

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then(user => {
								req.flash(
									'success_msg',
									'You are now registered check your mail for a verification code '
								);

								var mailoptions = {
									from: '"verify your email" <onsjabes@gmail.com>',
									to: email,
									subject: "Verification",
									html: `
											<div>
											<h1>lost and found  </h1>
												<h2>welcome ${name} ! </h2>
												<p>enter code <b> ${activationCode} </b> in the app to verify your email adress and complete verification </p>
												<p> this code <b> expires in 1 minute  </b> . <p>
												<a href="http://localhost:8000//users/verification">click here to insert your code</a>
												</div>`,
								}

								transporter.sendMail(mailoptions, function (err, info) {
									if (err) {
										console.log(err);
									}
									else {
										console.log('Verfication email is sent to your gmail account');
									}
								})
								tokenid = generateToken({
									email: newUser.email,
								})
								console.log("token", tokenid)
								res.cookie('session', tokenid)
								res.render('verification.html');
							})
							.catch(err => console.log(err));
					});
				});
			}
		});
	}
});

//verif  page 
router.get('/verification', (req, res) => res.render('verification.html'));


//verif 
router.post('/users/verification', async (req, res) => {

	const { code } = req.body

	email = jwt.decode(req.cookies.session).email
	console.log(email, code)
	//res.send('132') ; 
	let errors = [];


	const user = await User.findOne({ email });

	if (user) {
		console.log(user)
		const { expiresAt } = user.expiresAt;
		const { activationCode } = user.activationCode;

		if (expiresAt < Date.now()) {
			console.log('date verif')
			User.deleteMany({ email });
			errors.push({ msg: "expiered code retry registration" });
			res.render('verification.html', { errors });
		} 
		if (!activationCode == code) {
			console.log('code no')

			errors.push({ msg: "invalid code passed . check your email" })
			res.render('verification.html', { errors });
		}else {
			console.log('code yes')
	
			//success 
			await User.updateOne({ email }, { isActive: true });
			errors.push({
				msg: "valid verification now you can log in"
			})
			res.render('login.html',{errors});
		}
	} 
});

// Login Page
router.get('/login', (req, res) => res.render('login'));


// Login Page

router.post('/login', async (req, res) => {
	let errors = [];
	const { email, password } = req.body;
	console.log(req.body)
	// Check if both email and password fields are present in the request body
	if (!email || !password) {
		errors.push({ msg: 'Please provide both email and password' });
		res.render('login.html', { errors });
	} else {
		user = await User.findOne({ email })
		console.log(user)
		if (!user) {
			errors.push({ msg: 'User not found' });
			res.render('login.html', { errors });
		} else {
			salt = await bcrypt.genSalt(10)
			console.log(salt)
			password_hash = await bcrypt.hash(password, salt);
			console.log(password_hash)
			const isPasswordMatch = await bcrypt.compare(password, user.password);
			console.log(isPasswordMatch)
			if (isPasswordMatch) {
				if (user.isActive) {
					tokenid = generateToken({
						email: user.email,
					})
					res.cookie('session', tokenid)
					res.render('../index.html', { errors });
				} else {
					errors.push({ msg: 'User not active ' })
					res.render('login.html', { errors })
				}

			} else {
				errors.push({ msg: 'Password missmatch' })
				res.render('login.html', { errors })
			}

		}
	}
});


function generateToken(payload) {
	return jwt.sign(payload, "secret123", { expiresIn: "30d" });
}

module.exports = router;