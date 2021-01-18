const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    verify_account_token: {
        type: String,
        required: false,
    },
    verify_account_expire: {
        type: Date,
        required: false,
    },
    reset_password_token: {
        type: String,
        required: false,
    },
    reset_password_expire: {
        type: Date,
        required: false,
    }
});

module.exports = mongoose.model("User", UserSchema);