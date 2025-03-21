const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  account: {
    username: String,
  },
  token: String,
  hash: String,
  salt: String,
  favourites_characters: Array,
  favourites_comics: Array,
});

module.exports = User;
