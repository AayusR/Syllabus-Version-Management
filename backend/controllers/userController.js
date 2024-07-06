const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const registerUser = async (req, res) => {
    try {
        const { username, email, password, isAdmin } = req.body;

        const savedUser = await User.register(
            username,
            email,
            password,
            isAdmin
        );
        return res.status(200).json(savedUser);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
        });

        if (!user) {
            return res.status(401).json("Wrong Username");
        }
        const verify = await bcrypt.compare(req.body.password, user.password);
        if (!verify) {
            return res.status(404).json("Invalid Password");
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
module.exports = { registerUser, loginUser };
