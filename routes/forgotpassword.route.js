var express = require('express');
var router = express.Router();
var connection = require('../public/db/index.db');

router.get('/', function (req, res, next) {
    res.render('forgotpassword');
  });

  router.post('/forgotpassprocess', function (req, res, next) {
    let admin_email = req.body.admin_email;
    connection.query("select admin_pass from tbl_admin where admin_email=?", [admin_email], function (err, admin_row) {
      if (err) throw err;
      if (admin_row.length > 0) {
        var admin_pass = admin_row[0].admin_pass;
        "use strict";
        const nodemailer = require("nodemailer");
        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
          let testAccount = await nodemailer.createTestAccount();
  
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'testing.devloper.test@gmail.com', // generated ethereal user
              pass: 'test@4402', // generated ethereal password
            },
          });
          //take value from text box to session variable and session varivalr to simple variable
  
  
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: "Admin", // sender address
            to: admin_email, // list of receivers
            subject: "Forgot password", // Subject line
            text: admin_pass, // plain text body
            html: admin_pass, // html body
          });
          // '"Fred Foo 👻" <foo@example.com>'
  
          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }
  
        main().catch(console.error);
  
        res.send("Email Sent Successfully...")
      } else {
        res.send("No data Found..")
      }
    });
  });
module.exports=router;