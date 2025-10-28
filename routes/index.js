var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { layout: 'home_layout' });
});

router.get('/auth/register', function(req, res) {
  res.render('auth/register', { layout: 'layout' }); 
});

router.post('/auth/register', function(req, res) {
  console.log("Register Data:", req.body);
  res.send("Register Successful!"); 
});

module.exports = router;
