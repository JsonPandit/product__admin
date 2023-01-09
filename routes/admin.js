var express = require('express');
var router = express.Router();
var pool = require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');


router.get('/adminlogin', function (req, res, next) {
  res.render('adminlogin', { message: ' ' })
});


router.get('/adminlogout', function (req, res, next) {
  localStorage.clear()
  res.render('adminlogin', { message: ' ' })
});


router.post('/chkadminpassword', function (req, res, next) {
  pool.query("select * from administrators where (adminemail=? or adminmobile=?) and password=?", [req.body.emailmobile, req.body.emailmobile, req.body.password], function (error, result) {
    if (error) {
      res.render("adminlogin", { message: 'Server Error' })
    }
    else {
      if (result.length == 1) {
        localStorage.setItem("ADMIN", JSON.stringify(result[0]))
        res.render("dashboard", { data: result[0] })
      }
      else {
        res.render("adminlogin", { message: 'Invalid email address/mobile/password' })
      }
    }
  })

});

module.exports = router;
