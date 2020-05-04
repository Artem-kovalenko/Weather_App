module.exports = function(sequelize, Sequelize) {
 
    var User = sequelize.define('user', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
 
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue:123
        },
 
        firstname: {
            type: Sequelize.STRING,
            notEmpty: true,
        },
        
        cityNames: {
            type: Sequelize.STRING,
            defaultValue:""
        }


    });
    return User;
}