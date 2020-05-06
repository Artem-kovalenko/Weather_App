let request = require("request-promise"); 
let connection = require("../utilits/connection");

exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/signin');
}

exports.addCity = async function(req,res){
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
}

// Making request by city name from the DB ( to get the names makes request, too )
// and returns weather witch we are passing to the hbs template
exports.showCity = function (req, res) {
  
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
}

// making request by city nameand returns weather for 5 days per 3 hours
exports.fiveDaysWeather = function (req, res) {
    let currentUserId = req.user.id;
    connection.query(`SELECT * FROM users WHERE id=${currentUserId}`, async function (err, results) {
      if (err) console.log(err);

      let result = results[0].cityNames; // Получаем строку имен городов
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
}