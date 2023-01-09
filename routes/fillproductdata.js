var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');


router.get('/productinterface', function(req, res, next) {
   var admin=JSON.parse(localStorage.getItem("ADMIN"))
    if(admin)
    res.render('productinterface', { message:' ' });
    else
    res.render('adminlogin', { message:' ' });
});

router.post('/productsubmit',upload.single('picture'), function (req, res) {  

    pool.query("insert into productdetail (productid, productname, price, quantity, productdescription, picture) values(?,?,?,?,?,?)", [req.body.productid, req.body.productname, req.body.price, req.body.quantity, req.body.productdescription,req.file.originalname], function (error, result) {
        if (error) {
            console.log(error)
            res.render('productinterface', { 'message': 'Server Error' })
        }
        else {
            res.render('productinterface', { 'message': 'Record Submitted Successfully' })
        }
    })
})

 router.get('/displayallproduct', function (req, res) {
    var admin=JSON.parse(localStorage.getItem("ADMIN"))
    if(!admin)
    res.render('adminlogin', { message: '' })
    else
    pool.query("select * from productdetail", function (error, result) {

         if (error) {
             console.log(error)
             res.render('displayallproduct', { 'data': [], 'message': 'Server Error' })
         }
         else {
             res.render('displayallproduct', { 'data': result, 'message': 'Success' })
         }
     })

 })

router.get('/searchbyid', function (req, res) {
    var admin=JSON.parse(localStorage.getItem("ADMIN"))
    if(!admin)
    res.render('adminlogin', { message: '' })
    else
    pool.query("select * from productdetail  where productid=?", [req.query.productid], function (error, result) {

        if (error) {
            console.log(error)
            res.render('productbyid', { 'data': [], 'message': 'Server Error' })
        }
        else {
            res.render('productbyid', { 'data': result[0], 'message': 'Success' })
        }
    })

})


router.post('/product_edit_delete', function (req, res) {
   var admin=JSON.parse(localStorage.getItem("ADMIN"))
    if(!admin)
    res.render('adminlogin', { message: '' })
    else
    if (req.body.btn=="Edit") 
    {
        pool.query("update  productdetail set productname=?, price=?, quantity=?, productdescription=?  where productid=?",
        [req.body.productname, req.body.price, req.body.quantity, req.body.productdescription,req.body.productid],
        function (error, result) {

            if (error) 
            {   
              console.log(error)
                res.redirect('/product/displayallproduct')
            }
            else 
            {
                res.redirect('/product/displayallproduct')
            }


        })
    }
    else 
    {
           pool.query("delete from productdetail where productid=?", [req.body.productid], function (error, result) {
            if (error) {
                console.log(error)
                res.redirect('/product/displayallproduct')
            }
            else 
            {
                res.redirect('/product/displayallproduct')
            }
        })
    }
})


router.get('/searchbyidforimage', function (req, res) {
    var admin=JSON.parse(localStorage.getItem("ADMIN"))
    if(!admin)
    res.render('adminlogin', { message: '' })
    else
    pool.query("select * from productdetail where productid=?", [req.query.productid], function (error, result) {

        if (error) {
            console.log(error)
            res.render('showimage', { 'data': [], 'message': 'Server Error' })
        }
        else {
            res.render('showimage', { 'data': result[0], 'message': 'Success' })
        }
    })

})
router.post('/editimage', upload.single('picture'), function (req, res) {
    var admin=JSON.parse(localStorage.getItem("ADMIN"))
    if(!admin)
    res.render('adminlogin', { message: '' })
    else
    console.log("File",req.file)

    pool.query("update productdetail set picture=? where productid=?", [req.file.originalname,req.body.productid], function (error, result) {
        if (error) {
            console.log(error)
            res.redirect('/product/displayallproduct')
        }
        else {
            res.redirect('/product/displayallproduct')
        }
    })
})




module.exports = router;
