var exports = (module.exports = {});
let request = require("request-promise");
const mysql = require("mysql2");

exports.signup = function (req, res) {
  res.render("signup");
};

exports.signin = function (req, res) {
  res.render("signin");
};

exports.notFound = function (req, res) {
  res.render("notfound")
};

// ==================== Этот код делает запрос по имени города из БД(для получения имен также делает запрос) и возвращает результаты погоды которые мы передаем в шаблон для отображения =================
exports.dashboard = function (req, res) {
  const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "weather_app_users",
    password: "cubex",
  });

  connection.query("SELECT * FROM users", async function (err, results) {
    if (err) console.log(err);
    let currentUserId = req.user.id;

    let result = results[currentUserId - 1].cityNames; // Получаем строку имен городов
    let resultArr = result.split(","); // Создаём массив имен городов из полученной строки

    let weather_data = [];
    for (let city of resultArr) {
      if (city !== "") {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f5d7571e6ac64e7688a6abc151fa70b8`;

        // await - ждет пока прийдет ответ от запроса чтоб продолжить код
        await request(url) // вернёт промис, потому что не используем callBack
        .then(function(response) {
          let weather_json = JSON.parse(response);
          let weather = {
            city: city,
            temperature: (Math.floor(weather_json.main.temp - 273.15) * 100) / 100,
            description: weather_json.weather[0].description,
            icon: weather_json.weather[0].icon,
          };
            weather_data.push(weather);
          })
        .catch(function(err) {
          console.log(err)
        });
        
      } else null;
    }

    res.render("dashboard", { weather: weather_data });
    console.log(
      "++++++++++++++++++++++++++++++WEATHER DATA++++++++++++++++++++++++++++++++++++++++++"
    );
    console.log(weather_data);
  });
};
// =============================================================================

exports.fiveDaysWeather = function (req, res) {

  const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "weather_app_users",
    password: "cubex",
  });

  connection.query("SELECT * FROM users", async function (err, results) {
    if (err) console.log(err);
    let currentUserId = req.user.id;


    let result = results[currentUserId - 1].cityNames; // Получаем строку имен городов
    let resultArr = result.split(","); // Создаём массив имен городов из полученной строки

    let weatherFiveDays_data = [];
    for (let city of resultArr) { 
      if (city !== "" && city === req.params.name) {
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=f5d7571e6ac64e7688a6abc151fa70b8`;

        // await - ждет пока прийдет ответ от запроса чтоб продолжить код
        let response_body = await request(url); // вернёт промис, потому что не используем callBack

        let weatherFiveDays_json = JSON.parse(response_body);
  
     
        for (let weather of weatherFiveDays_json.list) {
        if(weather.dt_txt.includes('12:00:00')) {
          console.log(weather)
          let everyObjWeather = {
            city: city,
            time: weather.dt_txt,
            icon: weather.weather[0].icon,
            description: weather.weather[0].description,
            temperature: (Math.floor(weather.main.temp - 273.15) * 100) / 100,
            wind: weather.wind.speed,
            pressure: weather.main.pressure,
          };
          weatherFiveDays_data.push(everyObjWeather);
        }else null

        }
      } else null;
    }

    // console.log(weatherFiveDays_data)
    res.render("fiveDaysWeather", { fiveDaysWeather: weatherFiveDays_data });
  });
};

exports.logout = function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
};
