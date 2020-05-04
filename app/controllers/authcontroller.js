var exports = module.exports = {}
var request = require('request-promise');

exports.signup = function(req, res) {
 
    res.render('signup');
 
}

exports.signin = function(req, res) {
 
    res.render('signin');

}

// by city ID
// var cityId = '703448';
// var url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=f5d7571e6ac64e7688a6abc151fa70b8`;



// =====================================
// Получение данных из БД!!!!!!!!!!!!!(настроить чтоб мы получали массив айди городов(через Serializing and unserializing an array in javascript))
// =====================================
// const mysql = require("mysql2");
  
// const connection = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     database: "weather_app_users",
//     password: "cubex"
// });
 
// const sql = `SELECT * FROM users`;
 
// connection.query(sql, function(err, results) {
//     if(err) console.log(err);
//     let result = results[0].cityNames; // Получаем строку имен городов
//     let resultArr = result.split(',')  // Создаём массив имен городов из полученной строки

//     console.log(result);
//     console.log(resultArr);
//     console.log(resultArr[0]);


// // console.log(resultArr);
// connection.end();

// });


// ==================== Этот код делает запрос по имени города из БД и возвращает результаты погоды которые мы передаем в шаблон для отображения =========================================================

async function getWeather(cities) {
    let weather_data = [];
    
    for (let city of cities) {
        var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f5d7571e6ac64e7688a6abc151fa70b8`;

        // await - ждет пока прийдет ответ от запроса чтоб продолжить код
        let response_body = await request(url); // вернёт промис, потому что не используем callBack


        let weather_json = JSON.parse(response_body);

        var weather = {
            city: city,
            temperature: (Math.floor(weather_json.main.temp-273.15)*100) / 100,
            description: weather_json.weather[0].description,
            icon: weather_json.weather[0].icon
        };

        weather_data.push(weather);

    }

    return weather_data;

}

// by city Name
// var cityName = `Las Vegas`



exports.dashboard = function(req, res) {

// console.log(resultArr2)
 
    //request(url, function(error, response, body) {

        //weather_json = JSON.parse(body);
        // console.log(weather_json);

        // console.log(resultArr)

        var weather_data = {weather: weather};

        res.render('dashboard', weather_data);
    // })
}

// =============================================================================


exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');
 
    });
 
}