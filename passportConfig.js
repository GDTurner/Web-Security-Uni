/**
 *  File:        passportConfig.js
 *  Module:      CMP-7038B DEVELOPING SECURE SOFTWARE
 *  Title:       002 Secure Development Project and Presentation
 *  Author:      PGT12
 *
 *  Date:        2022
 *
 *  Description: File contains the code to setup passport.js module
 *
 *  Notes:       Settings and implementation of methods for the node.js passport
 *               authentication system. Adapted from code originally written by
 *               Conor Bailey, available at:
 *               https://github.com/conorbailey90/node-js-passport-login-postgresql
 *               This uses the industry standard passport.js system, known for
 *               security
 */


// const localstrat
const env = process.env.NODE_ENV || 'development';

const pg = require('pg');
const LocalStrategy = require("passport-local").Strategy;
const config = require('./config.js')[env];
const pool = new pg.Pool(config);
const bcrypt = require('bcrypt');


function initialise(passport) {
    const authenticateUser = (email, password, done) => {

        console.log(email + " " +  password )

        pool.query(
            'SELECT * FROM blogtest.users WHERE email_address = $1',
            [email], (err, results) => {
                if (err) {
                    throw err;
                }

                console.log(results.rows);
                console.log(results.length);
                console.log("Start")
                for(var i = 0; i < results.rows; i++) {
                    console.log(i)
                    console.log(results.rows[i]);
                }
                console.log("End")

                if (results.rows.length > 0) {
                    const current_user = results.rows[0];

                    // User details retrieved from database
                    const retrieved_username = current_user.username;
                    const retrieved_password = current_user.user_password;

                    console.log("\n")
                    console.log("user password: [" + password + "]");

                    // Compares passwords (bcrypt has built in salt)
                    bcrypt.compare(password, retrieved_password, (err, isMatch) => {

                        if (err) {
                            throw err;
                        }

                        if (isMatch) {
                            return done(null, current_user);
                        } else {
                            console.log("False");
                            return done(null, false, {message: "Incorrect username or password"});
                        }
                    });
                } else {
                    return done(null, false, {message: "Incorrect username or password"});
                }


            }
        );
    };

    // Tell passport extension to use passed in email and password to authenticate user
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            },
            authenticateUser
        )
    );

    // Serialisation and de-serialisation functions, to store user data in a session
    passport.serializeUser((user, done) => done(null, user.user_id));

    passport.deserializeUser((id, done) => {
        pool.query(`SELECT * FROM blogtest.users WHERE user_id = $1`, [id], (err, results) => {
            if (err) {
                return done(err);
            }
            console.log(`ID is ${results.rows[0].user_id}`);
            return done(null, results.rows[0]);
        });
    });


}

module.exports = initialise;

