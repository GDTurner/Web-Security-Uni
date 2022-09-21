// 2 Factor Authentication stuff is contained within this file
const crypto = require("crypto");


// Taken from here
// https://www.w3schools.com/nodejs/nodejs_email.asp
// var nodemailer = require('nodemailer');
//
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'secureblogsite@gmail.com',
//         // pass: 'cQ-([3@Fo"=RB}et])K^'
//         pass: 'xhajkwcugbtehcgj' // Custom app password
//     }
//
// });
//
// var mailOptions = {
//     from: 'secureblogsite@gmail.com',
//     to: 'ctd.sutcliffe@gmail.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
// };
//
// transporter.sendMail(mailOptions, function(error, info) {
//     if(error) {
//         console.log(error);
//     }
//     else {
//         console.log('Email sent to ' + String(mailOptions.to));
//     }
// });
//

// return Math.random() * (max - min) + min;


// console.log(String(generate_2fa_code()))

// code_str = generate_2fa_code();

// console.log(code_str);

console.log(generate_2fa_secure())


function generate_2fa_code() {
    twofa_code_str = ''

    for(let i = 0; i < 6; i++) {
        min = 0;
        max = 10;

        twofa_code_str = twofa_code_str + String(Math.floor(Math.random() * (10-0) + 0));

        // if (i == 2) {
        //     twofa_code_str = twofa_code_str + " ";
        // }
    }

    return twofa_code_str;
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




/*
Account functionality stuff

SELECT * FROM blog_posts WHERE user_id = ?
current_user_id will be here

List as a table
Give user option to delete


DELETE * FROM blog_posts WHERE id = ?
Delete a post from blog post table belonging to user



* */

