var express = require('express');
var router = express.Router();
var connection = require('../public/db/index.db');

router.get('/', function (req, res, next) {
    res.render('login', { title: 'login' });
  });

router.post('/loginprocess', (req, res, next) => {
    var admin_email = req.body.admin_email;
    var admin_pass = req.body.admin_pass;
    connection.query("select * from tbl_admin where admin_email=? and admin_pass=?", [admin_email, admin_pass], function (err, admin_row) {
      if (err) throw err;
      if (admin_email == admin_row[0].admin_email) {
  
        if (admin_pass == admin_row[0].admin_pass) {
  
          req.session.admin_id = admin_row[0].admin_id;
          req.session.admin_email = admin_row[0].admin_email;
          req.session.admin_name = admin_row[0].admin_name;
          // req.session.admin_pass = admin_row[0].admin_pass;
          console.log(req.session.admin_name);
          res.redirect('/adminform');
        } else {
          res.end("Password Not Matched")
        }
      } else {
        res.end("Email Not Matched..")
      }
    });
  });

module.exports=router;