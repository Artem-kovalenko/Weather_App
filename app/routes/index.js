let mainController = require('../controllers/mainController.js');
let routesController = require("../controllers/routesController")


module.exports = function(app, passport) {
 
    app.get('/', mainController.home);

    app.get('/signup', mainController.signup);

    app.get('/signin', mainController.signin);

    app.get('/dashboard',routesController.isLoggedIn, mainController.dashboard);

    app.get('/fiveDaysWeather/:name?', routesController.isLoggedIn, mainController.fiveDaysWeather);

    app.get('/notFound', mainController.notFound);

    app.get('/loginfailed', mainController.loginfailed);

    app.get('/logout',mainController.logout);

    app.post('/dashboard', routesController.isLoggedIn, routesController.addCity)

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup'
    }));
    
    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/loginfailed',
    }));

}


