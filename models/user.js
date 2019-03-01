'use strict';
const bcrypt = require("bcrypt"); 

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len:{
          args:[1,99],
          msg: "Invalid Username, must be between 1 and 99 characters."
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate:{
        isEmail: {msg: "Invalid Email Address."}
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8,99],
          msg: "password must be at least 8 characters."
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function(pendingUser, options){
        if (pendingUser && pendingUser.password) {
          var hash = bcrypt.hashSync(pendingUser.password, 12); 
          pendingUser.password = hash; 
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
  };

  // **** function to compare entered password to hashed password ****
  user.prototype.validPassword = function(passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password)
  };

  // **** function to remove password before sending the user object ****
  user.prototype.toJSON = function() {
    var userData = this.get();
    delete userData.password; 
    return userData;   
  }

  return user;
};