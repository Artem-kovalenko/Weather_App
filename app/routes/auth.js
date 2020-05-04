var authController = require('../controllers/authcontroller.js');
 
module.exports = function(app, passport) {
 
    app.get('/', authController.signin);

    app.get('/signup', authController.signup);

    app.get('/signin', authController.signin);

    app.get('/dashboard',isLoggedIn, authController.dashboard);

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



    //=========== Этот код добавляетназвание города из ИНПУТА в БД =================
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        database: "weather_app_users",
        password: "cubex"
    });
    app.post('/dashboard',isLoggedIn, function(req,res){

        // ========= Добавление имени города в БД(берем его из инпута)========

        var cityName = req.body.city_name;
        var stringifyedCityName = JSON.stringify(cityName)
        var cityNamesArr = ["Las Vegas", "Kyiv"];
        var serializedCityNamesArr = JSON.stringify(cityNamesArr);
        
        console.log(cityNamesArr);
        console.log(serializedCityNamesArr);
        console.log(cityName);
        console.log(stringifyedCityName)
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+cityName)
        console.log(req)
        // MycityName="Kyivvvvvv"
        const sql = `UPDATE users SET cityNames = CONCAT(cityNames, ",${cityName}") WHERE id=1;`;
        // const sql = `UPDATE users SET cityNames="${MycityName}" WHERE id=1;`;
        
        connection.query(sql, function(err, results) {
            if(err) console.log(err);
            console.log(results);
        });
        
        // connection.end();

        res.redirect('/dashboard')

    })
    //========================================================





    function isLoggedIn(req, res, next) {
    
        if (req.isAuthenticated())
        
            return next();
            
        res.redirect('/signin');
    
    }
}


