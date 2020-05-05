let authController = require('../controllers/authcontroller.js');
let request = require("request-promise");

module.exports = function(app, passport) {
 
    app.get('/', authController.signin);

    app.get('/signup', authController.signup);

    app.get('/signin', authController.signin);

    app.get('/dashboard',isLoggedIn, authController.dashboard);

    
    app.get('/fiveDaysWeather/:name?', isLoggedIn, authController.fiveDaysWeather);

    app.get('/notFound', authController.notFound);

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



    //=========== Этот код добавляет название города из ИНПУТА в БД ==========================
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        database: "weather_app_users",
        password: "cubex"
    });
    app.post('/dashboard',isLoggedIn, async function(req,res){

        // ========= Добавление имени города в БД(берем его из инпута)========
        let cityName = req.body.city_name;
        let currentUserId = req.user.id;

        // ДЕЛАЕМ ЗАПРОС ПО ИМЕНИ ГОРОДА ИЗ ИНПУТА И ЕСЛИ ОКЕЙ ТО ДОБАВЯЛЕМ В БД
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=f5d7571e6ac64e7688a6abc151fa70b8`;

        await request(url)
        .then(function(response) {
            let cityInfo = JSON.parse(response)
            let cityName = cityInfo.name
            const sql = `UPDATE users SET cityNames = CONCAT(cityNames, ",${cityName}") WHERE id=${currentUserId};`;
            console.log("============CITY FAS FOUND! LEST ADD IT TO DATABSE===================")
            connection.query(sql, function(err, results) {
                if(err) console.log(err);
            });
        })
        .catch(function(err){
            console.log("=====================CITY WAS NOT FOUND===============")
            res.redirect('/notFound')
        })
        res.redirect('/dashboard')
    })
    //=========================================================================================


    
    function isLoggedIn(req, res, next) {
    
        if (req.isAuthenticated())
        
            return next();
            
        res.redirect('/signin');
    
    }
}


