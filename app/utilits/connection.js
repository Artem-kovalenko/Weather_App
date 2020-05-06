const mysql = require("mysql2");

let connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "weather_app_users",
    password: "cubex"
});

module.exports = connection


