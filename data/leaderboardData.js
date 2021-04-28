const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    ID: String,
    names: String,
    values: String,
});

module.exports = mongoose.model("Leaderboard", schema);