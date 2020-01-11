const dotenv = require('dotenv').config();
const port = process.env.PORT || 4000;
let bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
let cors = require('cors');
let helmet = require('helmet');
const express = require("express");
const session = require('express-session');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production'; //true; false


const publicPath = path.join(__dirname, '/public');

let app = express();

app.set('trust proxy', 'loopback');

// adding security middleware
app.use(helmet());

app.use(cors({
    origin: '*',
    withCredentials: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Content-Type-Options', 'X-Frame-Options', 'Accept', 'Origin']
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

app.use(session({
    secret: 'jkhdskhadiuwhakjbsag678yguyisadg78',
    key: 'user_sid',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    // store: new MongoStore({
    //     url: process.env.DB_CONNECTION_STRING,
    //     touchAfter: 24 * 3600 // time period in seconds
    // })
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

// prevent user to get cached page on clicking back press after user is logged out
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.setHeader('X-Frame-Options', "ALLOWALL");
    next();
});


// Use `.hbs` for extensions and find partials in `views/partials`.
// for static files
app.use('/public', express.static(publicPath));

hbs.registerPartials(__dirname + '/views/partials')

app.set('view engine', 'hbs');
app.set('view options', {
    layout: 'layouts/app'
});

// create folder to upload images
// fs.mkdir(path.join(__dirname, 'public', 'uploads/'), err => console.log(err))

// Defining Routes
const homeAppRoute = require('./routes/home');

// Using routes
app.use('/', homeAppRoute);


app.get('*', function (req, res, next) {
    res.render('pages/404.hbs');
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});