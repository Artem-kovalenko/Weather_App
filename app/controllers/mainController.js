var exports = (module.exports = {});
let routesController = require("./routesController")

exports.home = function (req, res) {
  let isAuthenticated = req.isAuthenticated();
  let isAuthenticatedReverse = !req.isAuthenticated();
  res.render("home", { 
    userLoggedIn: isAuthenticated,
    userLoggedInReverse: isAuthenticatedReverse });
};

exports.signup = function (req, res) {
  res.render("signup");
};

exports.signin = function (req, res) {
  res.render("signin");
};

exports.notFound = function (req, res) {
  res.render("notfound");
};

exports.loginfailed = function (req, res) {
  res.render("loginfailed");
}

exports.logout = function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
};

exports.dashboard = routesController.showCity;

exports.fiveDaysWeather = routesController.fiveDaysWeather;