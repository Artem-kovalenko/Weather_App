let express = require('express');
let app = express();
let passport   = require('passport');
let session    = require('express-session');
let bodyParser = require('body-parser');
let env = require('dotenv').config();
let exphbs = require('express-handlebars');
const flash = require('connect-flash');

let request = require('request');

app.use(flash());

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// For Passport
app.use(session({ 
    secret: 'keyboard cat',
    resave: true, 
    saveUninitialized:true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');



//Models
let models = require("./app/models");

//Routes
let authRoute = require('./app/routes/auth.js')(app, passport);

//load passport strategies
require('./app/config/passport/passport.js')(passport, models.user);
 
//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});

app.listen(5000, function(err) {
 
    if (!err)
        console.log("Site is live-----------------------------------------------");
    else console.log(err )
 
});