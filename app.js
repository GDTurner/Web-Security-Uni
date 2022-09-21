/**
 *  File:        app.js
 *  Module:      CMP-7038B DEVELOPING SECURE SOFTWARE
 *  Title:       002 Secure Development Project and Presentation
 *  Author:      PGT12
 *
 *  Date:        2022
 *
 *  Description: File contains the code to run the secure blog site
 *
 *  Notes:       The authentication methods, including the setup of the passport
 *               configuration file, were adapted in part from the code written
 *               by Conor Bailey, available at:
 *               https://github.com/conorbailey90/node-js-passport-login-postgresql
 *               This uses the industry standard passport.js system, known for
 *               security
 *
 *               The emailing system was adapted from code available at
 *               https://www.w3schools.com/nodejs/nodejs_email.asp
 */

// * APP.JS SETUP BELOW * //
const env = process.env.NODE_ENV || 'development';
const config = require('./config.js')[env];


const express = require('express');
const session = require('express-session')
const app = express();


//// load ejs library
const ejs = require('ejs');

//load NODE postgres library
const pg = require('pg');

// handling form data
//npm install express-validator
const { body,validationResult } = require('express-validator');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//static file directory
app.use(express.static('public')); 

var crypto = require('crypto'); 


// Bcrypt
const bcrypt = require('bcrypt');
const flash = require('express-flash')


//Passport (login) initialisation / setup
const passport = require('passport');
const initialisePassport = require('./passportConfig');
const {sourceHashMap} = require("tailwindcss/lib/lib/sharedState");
const {json} = require("express");
const nodemailer = require("nodemailer");

initialisePassport(passport);

//set our view engine to use ejs templates
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false})); 
// 


// parse application/json
app.use(bodyParser.json())

// secret cookie
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

function decodeHTML(str){
    return str.replace(/&#([0-9]+);/g, function(full, int) {
        return String.fromCharCode(parseInt(int));
    });
}



app.get('/', (req, res) => {
	const title = "Home";
	let logged_in = false;
	let user_name = ""
	if (req.isAuthenticated()) {
		logged_in = true;
		user_name = req.user.username;
	}
	res.render('test', { title: title, logged_in: logged_in , user_name: user_name});
});

app.get('/posts', async (req, res) => {

	const pool = new pg.Pool(config);
	const client = await pool.connect();
	// const q = `SET search_path to blogtest; SELECT * FROM blog_posts ORDER BY created_at DESC;`;
	const q = `SET search_path to blogtest; SELECT username, id, title, post, created_at FROM users, blog_posts WHERE users.user_id = blog_posts.user_id ORDER BY created_at DESC;`;

	await client.query(q).then(results => {
			client.release();
			console.log(results);
			console.log(q);
			data = results[1].rows;
			// get the number of rows returned
			count = data.length;

			res.set({'Content-Type': 'text/html; charset=utf-8'});
			res.json({ data, rows:count });
		}, err => console.log(err)
	)});

app.get('/own_posts', async (req, res) => {

	const pool = new pg.Pool(config);
	const client = await pool.connect();
	let current_user_id = req.user.user_id;

	const q = `SET search_path to blogtest; SELECT username, id, title, post, created_at FROM users, blog_posts WHERE users.user_id = ${current_user_id} AND users.user_id = blog_posts.user_id ORDER BY created_at DESC;`;

	await client.query(q).then(results => {
			client.release();
			console.log(results);
			console.log(q);
			data = results[1].rows;
			// get the number of rows returned
			count = data.length;

			res.set({'Content-Type': 'text/html; charset=utf-8'});
			res.json({ data, rows:count });
		}, err => console.log(err)
	)});

app.get('/search_posts', async (req, res) => {

	const pool = new pg.Pool(config);
	const client = await pool.connect();
	// const q = `SET search_path to blogtest; SELECT * FROM blog_posts ORDER BY created_at DESC;`;
	const q = `SET search_path to blogtest; SELECT username, id, title, post, created_at FROM users, blog_posts WHERE users.user_id = blog_posts.user_id ORDER BY created_at DESC;`;

	await client.query(q).then(results => {
			client.release();
			console.log(results);
			console.log(q);
			data = results[1].rows;
			// get the number of rows returned
			count = data.length;

			res.set({'Content-Type': 'text/html; charset=utf-8'});
			res.json({ data, rows:count });
		}, err => console.log(err)
	)});

app.get('/new_post', checkNotAuthenticated, (req, res) => {

	const title = "New Post";
	res.render('new_post', { title: title, user_name: req.user.username, logged_in: true});
});

app.get('/login_form', (req, res) => {
	const title = "Login Form";
	res.render('login', { title: title});
});


app.get('/create_acc', (req, res) => {
	console.log("str");
	const title = "Create Account";
	res.render('create_account', { title: title});
});

app.get('/dashboard', checkNotAuthenticated, async (req, res) => {

	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET search_path to blogtest; SELECT two_factor FROM users WHERE username = '${req.user.username}'`;

	// Run query to see if 2FA enabled
	await client.query(q).then(results => {
		client.release();
		let data = results[1].rows[0];

		let two_factor = String(data.two_factor);

		let two_factor_enabled = false;
		if (two_factor === '1') {
			two_factor_enabled = true;
		}


		const title = "User Dashboard";
		res.render('dashboard', {title: title, user_name: req.user.username, logged_in: true, two_factor_enabled: two_factor_enabled});
	}

	)});

app.get('/check_two_factor', checkNotAuthenticated, async (req, res) => {


	const pool = new pg.Pool(config);

	pool.query(
		'SELECT two_factor FROM blogtest.users WHERE username = $1', [req.user.username],
		(err, results) => {
			if(err) {
				console.log(err);
			}

			let two_factor = String(results.rows[0]['two_factor']);
			console.log("we are here");
			console.log(two_factor)

			let two_factor_enabled = false;
			if (two_factor === '1') {
				const title = "Verify your account!";



				// Send email here
				let secureCode = generate_2fa_secure();
				console.log("secure code");
				console.log(secureCode);

				send_2fa_email(secureCode, req.user.email_address);



				// Store code in db along with userid
				pool.query(
					'INSERT INTO blogtest.two_factor_codes(user_id, code) ' +
					'VALUES ($1, $2) RETURNING user_id, code', [req.user.user_id, secureCode],
					(err, results) => {
						if (err){
							throw err
						}
						// console.log(results.rows);
						// console.log("success");
						const title = "Verify it's really you";
						// req.logout()
						res.render('two_factor_verification', {title: title, user_name: "", logged_in: false});
					}
				)


			} else {
				const title = "User Dashboard";
				console.log("Still running this ")
				res.render('dashboard', {title: title, user_name: req.user.username, logged_in: true, two_factor_enabled: two_factor_enabled});
			}
	});

	});

app.get('/turn_off_twofa', checkNotAuthenticated, async (req, res) => {


	const pool = new pg.Pool(config);

	pool.query(
		'UPDATE blogtest.users SET two_factor = 0 WHERE user_id = $1', [req.user.user_id],
		(err, results) => {
			if(err) {
				console.log(err);
			}

			const title = "User Dashboard";
			console.log("Still running this ")
			res.render('dashboard', {title: title, user_name: req.user.username, logged_in: true, two_factor_enabled: false});

		});

});

app.get('/turn_on_twofa', checkNotAuthenticated, async (req, res) => {


	const pool = new pg.Pool(config);

	pool.query(
		'UPDATE blogtest.users SET two_factor = 1 WHERE user_id = $1', [req.user.user_id],
		(err, results) => {
			if(err) {
				console.log(err);
			}

			const title = "User Dashboard";
			console.log("Still running this ")
			res.render('dashboard', {title: title, user_name: req.user.username, logged_in: true, two_factor_enabled: true});

		});

});


app.post('/enter_code', async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const code = String(req.body.code);

	const pool = new pg.Pool(config);

	pool.query(
		'SELECT * FROM blogtest.two_factor_codes WHERE code = $1', [code],
		(err, results) => {
			if(err) {
				console.log(err);
			}

			if (results.rows.length > 0){
				pool.query(
					'DELETE FROM blogtest.two_factor_codes WHERE user_id = $1', [req.user.user_id],
					(err, results) => {

						res.render('dashboard', {title: "User Dasboard", user_name: req.user.username, logged_in: true, two_factor_enabled: true});});


			} else {
				req.logout();
				return res.render('login', { title: "Login", errors});
			}

		});


	});

app.post('/create_acc',async (req, res)=>{
	let { username, email, password, password2 } = req.body; 
	console.log(
	  "logging",
	  username,
	  email,
	  password,
	  password2
	);
// sanitise inputs before they go into db
	let errors = [];

	if (!username || !email || !password || !password2){
		errors.push({message: "Please fill in all fields."})
	}

	if (password.length < 6){
		errors.push({message: "Passwords need to be a minimum of 8 characters"})
	}

	if (password !== password2){
		errors.push({message: "Passwords do not match. Enter the same password in both fields."})
	}

	if (errors.length > 0){
		const title = "Create Account";
		res.render('create_account', { title: title, errors});
	}else{

		var salt = crypto.randomBytes(64).toString('hex');
		let hashedPassword = await bcrypt.hash(password, 10);

		const pool = new pg.Pool(config);

		pool.query(
			'SELECT * FROM blogtest.users WHERE username = $1',
			[username], 
			(err, results) => {
				if(err) {
					console.log(err);
				}
				console.log('searching DB for username');
				console.log(results.rows);
				console.log(results.rows.length);
				console.log(typeof(results.rows.length))

				if (results.rows.length > 0){
					console.log("Booting");
					const title = "Create Account";
					errors.push({ message: 'Details already registered'})
					console.log("Returning now")
					return res.render('create_account', { title: title, errors});
			} else {
					pool.query(
						// $ helps with SQL injection
						'SELECT * FROM blogtest.users WHERE email_address = $1',
						[email],
						(err, results) => {
							if(err) {
								console.log(err);
							}
							console.log("\n\n\nRunning this query now")
							console.log("searching database");
							console.log(results.rows);

							if (results.rows.length > 0){
								const title = "Create Account";
								errors.push({ message: 'Details already registered'})
								// res.render('create_account', { title: title, errors});
								return res.render('create_account', { title: title, errors});

							}else{
								pool.query(
									'INSERT INTO blogtest.users(username, email_address, user_password) VALUES ($1, $2, $3) RETURNING username, email_address, user_password', [username, email, hashedPassword],
									(err, results) => {
										if (err){
											throw err
										}
										console.log(results.rows);
										console.log("success");
										const title = "Login Form";
										res.render('login', {title: title});
									}
								)
							}
						}
					);
				}
		});

	}
})


app.get('/post_confirm', (req, res) => {
	const title = "Post successfully submitted";
	res.render('postConfirm', { title: title});
});


app.get('/submitaccount', async (req, res) => {

	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET search_path to blogtest; INSERT INTO **** (****, ****) 
	values ('${a}', '${a}');`;
	
	await client.query(q).then(results => {
		client.release();
	    console.log(results);
	    console.log(q);
		data = results[1].rows;
		// get the number of rows returned
   		count = data.length;

		res.render('account_created', { data: data, rows:count });
	}, err => console.log(err)
	)});


app.get('/editpost/:id', async (req, res) => {
	const title = "Edit Post";
	const indexTitle = "TEST";	
	const id = req.params.id;

	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET search_path to blogtest; set client_encoding to 'UTF8'; SELECT * FROM blog_posts WHERE id = ${id};`;
	console.log('results', q)

	await client.query(q).then(results => {
		client.release();
		console.log(results);
		console.log(q);
			data = results[2].rows;
		console.log("data: ", data)
		res.render('edit_post', {title: title, user_name: req.user.username, logged_in: true});
	}, err => console.log("error message", err)
	)});
	

app.get('/linktest/:id', async (req, res) => {
	const title = "";
	const indexTitle = "TEST";	
	const id = req.params.id;

	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET search_path to blogtest; set client_encoding to 'UTF8'; SELECT * FROM blog_posts WHERE id = ${id};`;
	console.log('results', q)

	await client.query(q).then(results => {
		client.release();
	   console.log(results);
	   console.log(q);
   		data = results[2].rows;
		console.log("data: ", data)
		res.render('linktest', {title: title, user_name: req.user.username, logged_in: true});
	}, err => console.log("error message", err)
	)});


app.delete('/editpost/deletePost', async (req, res) => {
	const errors = validationResult(req);
		if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
		}

	console.log(req.body);
	const id = req.body.id;

	
	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET search_path to blogtest; DELETE FROM blog_posts WHERE id = '${id}';`;
	
	await client.query(q).then(results => {
		client.release();
		console.log(results);
		console.log(q);
			data = results[1].rows;
		console.log("data: ", data)
		res.json({ data});
	}, err => console.log(err)
	)});	

app.put('/editpost/submitEdit', async (req, res) => {
	const errors = validationResult(req);
		if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
		}
	const confirmed = "Post submitted successfully"
	console.log(req.body);
	const postTitle = req.body.title;
	const text = req.body.text;
	const id = req.body.id;
	console.log(text);
	
	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET search_path to blogtest; UPDATE blog_posts SET title = '${postTitle}', post = '${text}' WHERE id = '${id}'; SELECT * FROM blog_posts;`;
	
	await client.query(q).then(results => {
		client.release();
		console.log(results);
		console.log(q);
			data = results[1].rows;
		console.log("data: ", data)
		res.json({ data, confirmed: confirmed});
	}, err => console.log(err)
	)});

app.post('/submit', async (req, res) => {
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
	const confirmed = "Post submitted successfully"
	console.log(req.body);
	const postTitle = req.body.title;
	const text = req.body.text;
	console.log(text);
	
	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET search_path to blogtest; set client_encoding to 'UTF8'; INSERT INTO blog_posts (title, post, user_id) 
	values ('${postTitle}', '${text}', ${req.user.user_id}); SELECT * FROM blog_posts;`;
	
	await client.query(q).then(results => {
		client.release();
	    console.log(results);
	    console.log(q);
   		data = results[3].rows;
		console.log("data: ", data)
		res.json({ data, confirmed: confirmed});
	}, err => console.log(err)
	)});





app.post('/login_form',
	passport.authenticate('local',{
		successRedirect: '/check_two_factor',
		failureRedirect: '/login_form',
		failureFlash: true
	})

);

app.get("/log_out", (req, res) => {
	req.logout();
	res.redirect("/");
});

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("login_form");
}

function generate_2fa_secure() {
	twofa_code_str = '';

	for(let i = 0; i < 6; i++) {
		min = 0;
		max = 10;

		const n = crypto.randomInt(min, max);

		twofa_code_str = twofa_code_str + String(n);

	}

	return twofa_code_str;
}

function send_2fa_email(code, email_address) {
	// Code taken from here and adapted for coursework purposes
	// https://www.w3schools.com/nodejs/nodejs_email.asp
	// Function sends an email to a user if 2 factor authentication is enabled
	// for their account with a code to enter

	var nodemailer = require('nodemailer');

	email_text = "Your code to login to the blog site is " + String(code);

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'secureblogsite@gmail.com',
			pass: 'xhajkwcugbtehcgj' // Custom app password, more secure
		}

	});

	var mailOptions = {
		from: 'secureblogsite@gmail.com',
		to: email_address,
		subject: 'Secure Blog Site Verification Code',
		text: email_text
	};

	transporter.sendMail(mailOptions, function(error, info) {
		if(error) {
			console.log(error);
		}
		else {
			console.log('Email sent to ' + String(mailOptions.to));
		}
	});

}

app.listen(3000, () => console.log('Running on port 3000'));
