const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userID: String,
    userName: String,
    userPW: String,
    published_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
