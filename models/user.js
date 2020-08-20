const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userID: String,
    userName: String,
    userPW: String,
    published_date: String,
});

module.exports = mongoose.model("User", userSchema);
