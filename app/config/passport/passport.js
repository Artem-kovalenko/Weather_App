// В passport.js мы будем использовать модель пользователя и passport.

var bCrypt = require("bcrypt-nodejs"); // для защиты паролей


module.exports = function (passport, user) {
  // Внутри этого блока мы инициализируем локальную стратегию паспорта и модель пользователя,
  // которая будет передана в качестве аргумента.
  var User = user;
  var LocalStrategy = require("passport-local").Strategy;

  //LOCAL SIGNUP
  // Затем мы определяем нашу пользовательскую стратегию с нашим экземпляром LocalStrategy
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",

        passwordField: "password",

        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        // В этой функции мы будем обрабатывать данные пользователя.
        var generateHash = function (password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };

        User.findOne({
          where: {
            email: email,
          },
        }).then(function (user) {
          if (user) {
            return done(null, false, {
              message: "That email is already taken",
            });
          } else {
            var userPassword = generateHash(password);

            var data = {
              email: email,

              password: userPassword,

              firstname: req.body.firstname,

              lastname: req.body.lastname,
            };

            //User.create() - это метод Sequelize для добавления новых записей в базу данных.
            //Обратите внимание, что значения в объекте data берутся из объекта req.body,
            //который содержит входные данные из нашей регистрационной формы.
            User.create(data).then(function (newUser, created) {
              if (!newUser) {
                return done(null, false);
              }

              if (newUser) {
                return done(null, newUser);
              }
            });
          }
        });
      }
    )
  );
  
  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        
        passwordField: "password",

        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        var User = user;

        var isValidPassword = function (userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };

        User.findOne({
          where: {
            email: email,
          },
        })
          .then(function (user) {
            if (!user) {
              return done(null, false, {
                message: "Email does not exist",
              });
            }

            if (!isValidPassword(user.password, password)) {
              return done(null, false, req.flash('message','Invalid username or password'));
            }

            var userinfo = user.get();
            return done(null, userinfo);
          })
          .catch(function (err) {
            console.log("Error:", err);

            return done(null, false, {
              message: "Something went wrong with your Signin",
            });
          });
      }
    )
  );


  //serialize
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  // deserialize user
  passport.deserializeUser(function (id, done) {
    // User.findById(id).then(function(user) {
    User.findOne({ where: { id: id } }).then(function (user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });
};
