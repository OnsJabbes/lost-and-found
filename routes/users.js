const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const mongoose = require('mongoose');











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

const JWT_SECRET = "mysecretkey";

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
		} else {
			console.log('code yes')

			//success 
			await User.updateOne({ email }, { isActive: true });
			errors.push({
				msg: "valid verification now you can log in"
			})
			res.render('login.html', { errors });
		}
	}
});

// Login Page
router.get('/login', (req, res) => res.render('login.html'));


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
					if (user.isAdmin) {
						// Generate token for admin user
						let tokenid = generateToken({
						  email: user.email,
						  isAdmin: true
						});
						res.cookie('session', tokenid);
						// Redirect to the admin dashboard
						res.redirect('dashboard.html');
					  } else {
					  // Generate token for regular user
					  let tokenid = generateToken({
						email: user.email,
						isAdmin: false
					  });
					res.cookie('session', tokenid)
					res.render('../index.html', { errors }); }
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


// Admin Dashboard
router.get('/dashboard', (req, res) => {
	// Check if the user is logged in as an admin
	const token = req.cookies.session;
	const decodedToken = jwt.verify(token, 'secret123');
	if (decodedToken.isAdmin) {
	  // Render the admin dashboard
	  res.render('dashboard.html');
	} else {
	  // Redirect to the login page or show an error message
	  res.redirect('/login');
	}
  });

// Configuration 
cloudinary.config({
	cloud_name: "drdvbbr1d",
	api_key: "848374464672151",
	api_secret: "4Vxmnt7bITpi-trjT2HOT_Ju_0E"
});

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'profiles/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
const upload = multer({ storage: storage });




// Handle POST requests to upload an imagee
router.post('/profil', upload.single('image'), function (req, res) {
	// Get the path to the uploaded file
	const imagePath = req.file.path;

	// Upload the image to Cloudinary
	cloudinary.uploader.upload(imagePath, function (err, result) {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}
		console.log(result);

		// Create a new Profile with the uploaded image URL
		const newUser = new User({
			name: req.body.name,
			website: req.body.website,
			email: req.body.email,
			phone: req.body.phone,
			image: result.url,

		});

		// Save the new profile to the database
		newUser.save()
			.then(() => {
				res.redirect('/dashboard-profile.html');
			})
			.catch((error) => {
				console.log(error);
				// handle errorr
			});
	});
});




// Handle PUT requests to update an profile
router.post('/profiles/edit', upload.single('image'), (req, res) => {

	const email = jwt.decode(req.cookies.session).email;
	// Find the profile by ID
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				return res.status(404).json({ error: 'Profile not found' });
			}

			// Update the profile with the new data
			user.name = req.body.name;
			user.website = req.body.website;
			user.email = req.body.email;
			user.phone = req.body.phone;
			

			// Upload the new image to Cloudinary if provided
			if (req.file) {
				const imagePath = req.file.path;
				cloudinary.uploader.upload(imagePath, function (err, result) {
					if (err) {
						console.log(err);
						return res.status(500).send(err);
					}
					console.log(result);
					user.image = result.url;
					// Save the updated profile to the database
					user.save()
						.then(() => {
							res.redirect('/profiles');
						})
						.catch((error) => {
							console.log(error);
							// handle error
						});
				});
			} else {
				// Save the updated profile to the database
				user.save()
					.then(() => {
						res.redirect('/profiles');
					})
					.catch((error) => {
						console.log(error);
						// handle error
					});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Error updating profile' });
		});
});





// Handle DELETE requests to delete an item
router.post('/delete/:id', (req, res) => {


	const userId = req.params.id;

	Profile.findByIdAndDelete(userId)
		.then(() => {
			res.redirect('back');

		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Error deleting user' });
		});
});

router.get('/profiles', (req, res) => {

	const email = jwt.decode(req.cookies.session).email;
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				return res.status(404).json({ error: 'Profile not found' });
			}
			res.render("../dashboard-profile.html", { user });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'Error reading profile' });
		});
});



router.post('/profiles/edit-password', upload.single('image'), (req, res) => {
    const email = jwt.decode(req.cookies.session).email;
    // Find the profile by email
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'Profile not found' });
            }

            // Update the profile with the new data
            // Hash the new password
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Error updating password' });
                }

                user.password = hash;

                // Upload the new image to Cloudinary if provided
                if (req.file) {
                    const imagePath = req.file.path;
                    cloudinary.uploader.upload(imagePath, function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send(err);
                        }
                        console.log(result);
                        user.image = result.url;
                        // Save the updated profile to the database
                        user.save()
                            .then(() => {
                                res.redirect('/profiles');
                            })
                            .catch((error) => {
                                console.log(error);
                                // handle error
                            });
                    });
                } else {
                    // Save the updated profile to the database
                    user.save()
                        .then(() => {
                            res.redirect('/profiles');
                        })
                        .catch((error) => {
                            console.log(error);
                            // handle error
                        });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error updating profile' });
        });
});


router.get('/logout', (req, res) => {
	res.clearCookie('session');
	res.redirect('./Sliding-Sign-In-Sign-Up-Form-master/login.html');
  });
  


router.get('/forgot-password', (req, res) => {
	res.render('email.html');
});

router.post("/forgot-password", async (req, res) => {
	let errors = [];
	const { email } = req.body;

	try {
		if (!email ) {
			errors.push({ msg: 'Please provide your email ' });
			res.render('email.html', { errors });
		} else {
			const oldUser = await User.findOne({ email });
			
			if (!oldUser) {
				errors.push({ msg: 'User not found' });
				res.render('email.html', { errors });
			} else {
				const secret = JWT_SECRET + oldUser.password;
				const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
					expiresIn: "30m",
				});
				
				const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
				console.log(link);
				var mailoptions = {
					from: 'onsjabes@gmail.com',
					to: email,
					subject: "reset password",
					html: `
						<div>
						    <h1>lost and found  </h1>
							<p>Please click on the following link to reset your password:</p>
		                    <a href="${link}">${link}</a>
		                    <p>If you did not request a password reset, please ignore this email.</p>
		                    <p>Regards,</p>
		                    <p>Lost and Found Team</p>
							
						</div>`,
				}

				transporter.sendMail(mailoptions, function (err, info) {
					if (err) {
						console.log(err);
					} else {
						console.log('Verification email is sent to your gmail account');
					}
					errors.push({ msg: "a reset link is sent to your email adresse " });
					res.render('email.html', { errors }); 	
				})
			}
		}
	} catch (error) {
		console.log(error);
	}
});

router.get("/reset-password/:id/:token", async (req, res) => {
	let errors = [];
	const { id, token } = req.params;
	try {
	  const oldUser = await User.findOne({ _id: id });
	  if (!oldUser) {
		errors.push({ msg: 'User not found' });
		return res.render('login.html', { errors });
	  }
	  
	  const secret = JWT_SECRET + oldUser.password;
	  try {
		const verify = jwt.verify(token, secret);
		errors.push({ msg: 'password changed successfully ' });
		return res.render("password.html", { email: verify.email });
	  } catch (error) {
		errors.push({ msg: 'token not verified' });
		return res.render('login.html', { errors });
	  }
	} catch (error) {
	  console.log(error);
	  return res.render('login.html', { errors });
	}
  });
  
  router.post("/reset-password/:id/:token", async (req, res) => {
	let errors = [];
	const {token,id} = req.params
	const  password  = req.body.password;
	console.log(req.body)
	try {
	  const oldUser = await User.findOne({ _id: id });
	  console.log(oldUser)
  
	  if (!oldUser) {
		errors.push({ msg: 'User not found' });
		return res.render('login.html', { errors });
	  }
  
	  const secret = JWT_SECRET + oldUser.password;
  
	  try {
		const encryptedPassword = await bcrypt.hash(password, 10);
  
		await User.updateOne(
		  {
			_id:id,
		  },
		  {
			$set: {
			  password: encryptedPassword,
			},
		  }
		);
		res.send('true');
		res.end()
		return ;
	  } catch (error) {
		console.log(error);
		return res.json({ status: "Something Went Wrong" });
	  }
	} catch (error) {
	  console.log(error);
	  errors.push({msg:error})
	  return res.render('login.html', { errors });
	}
  });
  




module.exports = router;