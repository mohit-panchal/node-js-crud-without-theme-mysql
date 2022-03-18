var express = require('express');
var router = express.Router();
var connection = require('../public/db/index.db');

//it use to fatch category form 
router.get('/', function (req, res, next) {
    if (req.session.admin_id) {
        res.render('categoryform', { title: 'category' });
    } else {
        console.log("Please Login First..");
        res.redirect('/login');
    }
});

//it use to submit category data into category table in data base.
router.post('/categoryprocess', function (req, res, next) {
    const categorydata = {
        category_name: req.body.category_name
    }
    connection.query("insert into tbl_category set?", categorydata, function (err) {
        if (err) throw err;
        console.log("Data Inserted Successfully..");
        res.redirect('/categoryform');
    });
});

//it use to get category data from database and display into form.
router.get('/getcategorydataprocess', function (req, res, next) {
    connection.query("select * from tbl_category", function (err, categoryrow) {
        if (err) throw err;
        res.render('categorydisplay', { categoryarray: categoryrow });
    });
});

//process to delete category data
router.get('/getcategoryprocess/catdelete/:id', function (req, res, next) {
    var catdeleteid = req.params.id;
    console.log("Delete Id is" + catdeleteid);
    connection.query("delete from tbl_category where category_id=?", [catdeleteid], (err) => {
        if (err) throw err;
        console.log("Record Delted Successfully..");
        res.redirect('/categoryform/getcategorydataprocess');
    });
});

//step-1 to get edit data in edit form
router.get('/getcategoryprocess/catedit/:id', function (req, res, next) {
    var cateditid = req.params.id;

    console.log("Your edit id is " + cateditid);
    connection.query("select * from tbl_category where category_id=?", [cateditid], function (err, category_row) {
        if (err) throw err;
        console.log(category_row);
        res.render('categoryedit', { category_array: category_row });
    });
});

//step-2 to set edited data into database
router.post('/getcategoryprocess/catedit/:id', function (req, res, next) {
    var cateditid = req.params.id;
    var category_name = req.body.category_name;
    connection.query("update tbl_category set category_name=? where category_id=?", [category_name, cateditid], function (err) {
        if (err) throw err;
        res.redirect('/categoryform/getcategorydataprocess');
    });
});

module.exports = router;