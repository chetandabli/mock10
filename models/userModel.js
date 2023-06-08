const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username: String,
    email: String,
    password: String
})

const UserModel = mongoose.model("/user", schema);

module.exports = {
    UserModel
}