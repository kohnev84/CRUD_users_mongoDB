const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    education: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    gender: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);