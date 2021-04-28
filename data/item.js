const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    ID: String,
    testItemn: Number
});

module.exports = mongoose.model("Items", schema);