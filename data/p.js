const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    Prefixes: String,
    ID: String,
});

module.exports = mongoose.model("Prefixes", schema);