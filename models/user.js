const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  admin: {
    type: Boolean
  },
  location:{
    type: String
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByLogin = function(login, callback) {
  const query = {
    $or: [{
        username: new RegExp('^' + login + '$', "i")
      },
      {
        email: new RegExp('^' + login + '$', "i")
      }
    ]
  }
  User.findOne(query, callback);
}

module.exports.addUser = function(id, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.deleteUser = function(id, callback){
  id = mongoose.mongo.ObjectID(id);
  User.findByIdAndRemove(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}

module.exports.checkUsername = function(user, callback) {
  User.count({
    'username': new RegExp(user, "i")
  }).count(callback);
}

module.exports.changePassword = function(id, newPassword, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newPassword, salt, (err, hash) => {
      if (err) throw err;
      newPassword = hash;
      User.findByIdAndUpdate(id, {
        password: newPassword
      }, callback);
    });
  });
}
