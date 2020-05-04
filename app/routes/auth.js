let authController = require('../controllers/authcontroller.js');
 
module.exports = function(app, passport) {
 
    app.get('/', authController.signin);

    app.get('/signup', authController.signup);

    app.get('/signin', authController.signin);

    app.get('/dashboard',isLoggedIn, authController.dashboard);

    
    app.get('/fiveDaysWeather', isLoggedIn, authController.fiveDaysWeather);


    app.get('/logout',authController.logout);

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    
    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/signin',
        failureFlash: true
    }));



    //=========== Этот код добавляет название города из ИНПУТА в БД =================
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        database: "weather_app_users",
        password: "cubex"
    });
    app.post('/dashboard',isLoggedIn, function(req,res){

        // ========= Добавление имени города в БД(берем его из инпута)========
        let cityName = req.body.city_name;
        let currentUserId = req.user.id;

        const sql = `UPDATE users SET cityNames = CONCAT(cityNames, ",${cityName}") WHERE id=${currentUserId};`;
        
        connection.query(sql, function(err, results) {
            if(err) console.log(err);
        });

        res.redirect('/dashboard')
    })
    //========================================================

    function isLoggedIn(req, res, next) {
    
        if (req.isAuthenticated())
        
            return next();
            
        res.redirect('/signin');
    
    }
}


