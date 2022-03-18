var express = require('express');
const session = require('express-session');
const res = require('express/lib/response');
var router = express.Router();
var connection = require('../public/db/index.db');

/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/adminform', function (req, res, next) {
  if (req.session.admin_id) {
    res.render('adminform', { admin_name: req.session.admin_name });
  } else {
    console.log("Please Login First..");
    res.redirect('/login');
  }

});

//categoryform route it have a it's own route.

//productform router it have it's own route.

router.get('/userform', function (req, res, next) {
  if (req.session.admin_id) {
    res.render('userform', { title: 'user' });
  } else {
    console.log("Please Login First..");
    res.redirect('/login');
  }

});

//for change password make different route file.

//forgot password make different route file.


//table-1
//process to add admin data in database
router.post('/adminprocess', (req, res, next) => {
  console.log(req.body);
  const admindata = {
    admin_name: req.body.admin_name,
    admin_email: req.body.admin_email,
    admin_pass: req.body.admin_pass
  }
  connection.query("insert into tbl_admin set ?", admindata, (err) => {
    if (err) throw err;
    console.log("Data INserted...");
    res.redirect('/adminform');
  });
});
//process to display admin data database to form
router.get('/getadmindataprocess', (req, res, next) => {
  connection.query("select * from tbl_admin", (err, admin_row) => {
    if (err) throw err;
    res.render('admindisplay', { admin_array: admin_row })
  });
});
//delete admin data 
router.get('/admindelete/:id', function (req, res, next) {
  var admindeleteid = req.params.id;
  console.log("Delete Id is " + admindeleteid);
  connection.query("delete from tbl_admin where admin_id=?", [admindeleteid], function (err) {
    if (err) throw err;
    console.log("Data deleted successfully");
    res.redirect('/getadmindataprocess');
  });
});
//step-1 to get edit data in edited form
router.get('/adminedit/:id', function (req, res, next) {
  var admineditid = req.params.id;
  console.log("Your edit id is " + admineditid);
  connection.query("select * from tbl_admin where admin_id=?", [admineditid], function (err, admin_row) {
    if (err) throw err;
    res.render('adminedit', { admin_array: admin_row });
  });
});
//step-2 to set edited data into database
router.post('/adminedit/:id', function (req, res, next) {
  var admineditid = req.params.id;
  var admin_name = req.body.admin_name;
  var admin_email = req.body.admin_email;
  var admin_pass = req.body.admin_pass;
  connection.query("update tbl_admin set admin_name=?,admin_email=?,admin_pass=? where admin_id=?", [admin_name, admin_email, admin_pass, admineditid], function (err) {
    if (err) throw err;
    console.log("Data Edited successfully..");
    res.redirect('/getadmindataprocess');
  });
});

//table-2 category table route is different  make new route for that.

//table-3 Product table route is different  make new route for that.

//table-4
//process to set userdata in database
router.post('/userprocess', function (req, res, next) {
  const userdata = {
    user_name: req.body.user_name,
    user_gender: req.body.user_gender,
    user_email: req.body.user_email,
    user_mobile: req.body.user_mobile,
    user_pass: req.body.user_pass,
    user_address: req.body.user_address
  }
  connection.query("insert into tbl_user set ?", userdata, function (err) {
    if (err) throw err;
    console.log("Data inserted...");
    res.redirect('/userform');
  });
});
//process to get user data frome data base to displary form
router.get('/getuserdataprocess', function (req, res, next) {
  connection.query("select * from tbl_user", function (err, user_row) {
    if (err) throw err;
    res.render('userdisplay', { user_array: user_row });
  });
});
//process to delete user data
router.get('/userdelete/:id', function (req, res, next) {
  var userdeleteid = req.params.id;
  console.log("Your delete id is" + userdeleteid);
  connection.query("delete from tbl_user where user_id=?", [userdeleteid], function (err) {
    if (err) throw err;
    console.log("Record deleted successfully...");
    res.redirect('/getuserdataprocess');
  });
});
//step-1 process to get edit data into form
router.get('/useredit/:id', function (req, res, next) {
  var usereditid = req.params.id;
  console.log("edit id is" + usereditid);
  connection.query("select * from tbl_user where user_id=?", [usereditid], function (err, user_row) {
    if (err) throw err;
    console.log(user_row);
    res.render('useredit', { user_array: user_row });
  });
});
//step-2 process set edited data into databse
router.post('/useredit/:id', function (req, res, next) {
  var usereditid = req.params.id;
  const userdata = {
    user_name: req.body.user_name,
    user_gender: req.body.user_gender,
    user_email: req.body.user_email,
    user_mobile: req.body.user_mobile,
    user_pass: req.body.user_pass,
    user_address: req.body.user_address
  }
  connection.query("update tbl_user set ? where user_id=?", [userdata, usereditid], function (err) {
    if (err) throw err;
    console.log("Data Updated....");
    res.redirect('/getuserdataprocess');
  });
});

//login process make different route file

//for logout sesssion destroy
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});
module.exports = router;
