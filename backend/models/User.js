const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

UserSchema.statics.register = async function (
    username,
    email,
    password,
    isAdmin
) {
    if (!email || !password || !username) {
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password not strong enough");
    }
    const mailexists = await this.findOne({ email });
    if (mailexists) {
        throw Error("Email already in use");
    }
    const usernameExists = await this.findOne({ username });
    if (usernameExists) {
        throw Error("Username already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.create({username,email,password:hashedPassword,isAdmin})
    return user
};

module.exports = mongoose.model("User", UserSchema);
