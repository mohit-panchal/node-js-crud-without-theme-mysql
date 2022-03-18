var express = require('express');
var router = express.Router();
var connection = require('../public/db/index.db');

router.get('/', function (req, res, next) {
    if (req.session.admin_id) {
      res.render('changepassword');
    } else {
      console.log("Please Login First..");
      res.redirect('/login');
    }
  });
  //change password process
  router.post('/changepassprocess', function (req, res, next) {
    var opass = req.body.opass;
    var npass = req.body.npass;
    var cpass = req.body.cpass;
    var admin_id = req.session.admin_id;
    connection.query("select * from tbl_admin where admin_id=?", [admin_id], function (err, admin_row) {
      if (admin_row.length > 0) {
        if (err) {
          res.send(err);
        } else {
          if (opass == admin_row[0].admin_pass) {
            if (npass == cpass) {
              connection.query("update tbl_admin set admin_pass=? where admin_id=?", [npass, admin_id], function (err) {
                if (err) throw err;
                res.send("Password Change Successfully...");
                
              });
            } else {
              res.send("New Password & Confirm Password not matched...")
            }
          } else {
            res.send("Old Password Not Matched.")
          }
        }
      } else {
        res.send("No Data Found..");
      }
    });
  });

module.exports=router;