var express = require('express');
var router = express.Router();
var connection = require('../public/db/index.db');

router.get('/', function (req, res, next) {
    if (req.session.admin_id) {
        connection.query("select category_name from tbl_category", function (err, category_row) {
            if (err) throw err;
            res.render('productform', { category_array: category_row });
        });

    } else {
        console.log("Please Login First..");
        res.redirect('/login');
    }
});

//process to send data into database
router.post('/productprocess', function (req, res, next) {
    var fileobj = req.files.product_image;
    var filenm = req.files.product_image.name;
    var filepath = "/uploadimage/";
    fileobj.mv('public/uploadimage/' + filenm, function (err) {
        if (err) throw err;
        console.log("File Upload Successfully..");
    });

    var category_name = req.body.category_name;
    connection.query("select category_id from tbl_category where category_name=?", [category_name], function (err, category_row) {
        if (err) throw err;
        const productdata = {
            product_name: req.body.product_name,
            product_details: req.body.product_details,
            product_price: req.body.product_price,
            product_image: filepath + filenm,
            category_id: category_row[0].category_id
        }
        connection.query("insert into tbl_product set ?", productdata, function (err) {
            if (err) throw err;
            console.log("Data Inserted");
            res.redirect('/productform');
        });
    });
});

//process to display product data into table form
router.get('/getproductdataprocess', function (req, res, next) {
    var productquery = "SELECT `tbl_product`.`product_id`, `tbl_product`.`product_name`, `tbl_product`.`product_details`, `tbl_product`.`product_price`, `tbl_product`.`product_image`, `tbl_category`.`category_name` FROM `tbl_category` INNER JOIN `tbl_product` ON (`tbl_category`.`category_id` = `tbl_product`.`category_id`)";
    connection.query(productquery, function (err, product_row) {
        if (err) throw err;
        console.log(product_row);
        res.render('productdisplay', { product_array: product_row });
    });
});

//process to delete product data into database
router.get('/getproductdataprocess/productdelete/:id', function (req, res, next) {
    var prodeleteid = req.params.id;
    console.log("Your delete id is" + prodeleteid);
    connection.query("delete from tbl_product where product_id=?", [prodeleteid], function (err) {
        if (err) throw err;
        console.log("Data deleted..");
        res.redirect('/productform/getproductdataprocess');
    });
});

//step-1 process to get data into edit form
router.get('/getproductdataprocess/productedit/:id', function (req, res, next) {
    var proeditid = req.params.id;
    console.log("YOur Edit id is" + proeditid);
    connection.query("select * from tbl_product where product_id=?", [proeditid], function (err, product_row) {
      if (err) throw err;
      console.log(product_row);
      res.render('productedit', { product_array: product_row });
    });
  });

  //step-2 process to set edited data into database
router.post('/getproductdataprocess/productedit/:id', function (req, res, next) {
    var proeditid = req.params.id;
    var product_name = req.body.product_name;
    var product_details = req.body.product_details;
    var product_price = req.body.product_price;
    var product_image = req.body.product_image;
    var category_id = req.body.category_id;
    connection.query("update tbl_product set product_name=?,product_details=?,product_price=?,product_image=?,category_id=? where product_id=?", [product_name, product_details, product_price, product_image, category_id, proeditid], function (err) {
      if (err) throw err;
      console.log("Data Updated Successully....");
      res.redirect('/productform/getproductdataprocess');
    });
  });
module.exports = router;