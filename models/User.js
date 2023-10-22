const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true},
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profile: {
            type: String,
            required:false,
            default: "https://imgur.com/ua5gO8l" //default user profile image
        },

    }, { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema)