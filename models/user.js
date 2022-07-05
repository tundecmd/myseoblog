const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32,
            unique: true,
            index: true,
            lowercase: true,
        },
        name: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32,
            unique: true,
            index: true,
            lowercase: true,
        },
        profile: {
            type: String,
            // required: true,
        },
        hashed_password: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
        },
        about: {
            type: String,
        },
        role: {
            type: Number,
            trim: true,
        },
        photo: {
            data: Buffer,
            contentType: String,
        },
        resetPasswordLink: {
            data: String,
            default: "",
        },
    },
    { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compare(password, this.hashed_password);
    },
};

module.exports = mongoose.model("User", userSchema);
