const User = require("../models/User");

exports.getCurrentUser = (id) => {
  User.findById(id).then((user) => {
    return user;
  });
};
