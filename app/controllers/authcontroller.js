var exports = module.exports = {}
let request = require('request-promise');
const mysql = require("mysql2");

exports.signup = function(req, res) {
 
    res.render('signup');
 
}

exports.signin = function(req, res) {
 
    res.render('signin');

}

// ==================== Этот код делает запрос по имени города из БД(для получения имен также делает запрос) и возвращает результаты погоды которые мы передаем в шаблон для отображения =================
exports.dashboard = function(req, res) {

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "weather_app_users",
    password: "cubex"
});

connection.query("SELECT * FROM users", async function(err, results) {
    if(err) console.log(err);
    let currentUserId = req.user.id;

    let result = results[currentUserId - 1].cityNames; // Получаем строку имен городов
    let resultArr = result.split(',')  // Создаём массив имен городов из полученной строки

    let weather_data = [];
    for (let city of resultArr) {
        if (city !== "") {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f5d7571e6ac64e7688a6abc151fa70b8`;

        // await - ждет пока прийдет ответ от запроса чтоб продолжить код
        let response_body = await request(url); // вернёт промис, потому что не используем callBack

        let weather_json = JSON.parse(response_body);

        let weather = {
            city: city,
            temperature: (Math.floor(weather_json.main.temp-273.15)*100) / 100,
            description: weather_json.weather[0].description,
            icon: weather_json.weather[0].icon
        };

        weather_data.push(weather);
        }
        else null
    }


    res.render("dashboard", {weather: weather_data})
    console.log("++++++++++++++++++++++++++++++WEATHER DATA++++++++++++++++++++++++++++++++++++++++++")
    console.log(weather_data)
})
}
// =============================================================================


exports.fiveDaysWeather = function(req, res) {

// ПЛАН НА БЛОКНОТЕ!!!!!!!!!!!!!!!!!!

    const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        database: "weather_app_users",
        password: "cubex"
    });
    
    connection.query("SELECT * FROM users", async function(err, results) {
        if(err) console.log(err);
        let currentUserId = req.user.id;
    
        let result = results[currentUserId - 1].cityNames; // Получаем строку имен городов
        let resultArr = result.split(',')  // Создаём массив имен городов из полученной строки
    
        let weather_data = [];
        for (let city of resultArr) {
            if (city !== "") {
                let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=f5d7571e6ac64e7688a6abc151fa70b8`;
    
            // await - ждет пока прийдет ответ от запроса чтоб продолжить код
            let response_body = await request(url); // вернёт промис, потому что не используем callBack

            let weatherFiveDays_json = JSON.parse(response_body);
            // let weatherFiveDaysList = weatherFiveDays_json.list

            //     console.log("_________________weatherFiveDays_json______________________________")
            //     console.log(weatherFiveDays_json)

            //     console.log("_________________weatherFiveDaysLists______________________________")
            //     console.log(weatherFiveDaysList)

            for (let weather of weatherFiveDays_json.list) {
                if(weather.dt_txt === "2020-05-05 12:00:00") {
                    console.log("---weather---")
                    console.log(weather)
                }
                else null

            }


            // console.log("---MAIN---")
            // console.log(weatherFiveDaus_json.list[0].main)
            // console.log("---WEATHER---")
            // console.log(weatherFiveDaus_json.list[0].weather)
            // console.log("---WIND---")
            // console.log(weatherFiveDaus_json.list[0].wind)
            // console.log("---DATE---")
            // console.log(weatherFiveDaus_json.list[0].dt_txt)


            // console.log(weatherFiveDaus_json.list[0].main)
            
            // let weather = {
            //     city: city,
            //     temperature: (Math.floor(weather_json.main.temp-273.15)*100) / 100,
            //     description: weather_json.weather[0].description,
            //     icon: weather_json.weather[0].icon
            // };
            
            // weather_data.push(weather);
            }
            else null
        }
    
    
        res.render('fiveDaysWeather')
    })
    

}

exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');
 
    });
 
}