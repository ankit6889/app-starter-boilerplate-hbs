const express = require("express");
var router = express.Router();

router.get('/', (req, res) => {
    res.render('order/orders');
});


router.get('/login', (req, res) => {
    res.render('login');
});


router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/overview', (req, res) => {
    res.render('overview');
});

router.get('/account', (req, res) => {
    res.render('account');
});

router.get('/table_data', (req, res) => {
    res.render('table_data');
});

module.exports = router;