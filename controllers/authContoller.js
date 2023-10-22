const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");



module.exports = {
    createUser: async (req, res) => {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
        });
        try {
            const savedUser = await newUser.save();
            res.status(201).json(savedUser)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            !user && res.status(401).json("Login Failed: Wrong Login Details")


            const decrytedpass = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const depassword = decrytedpass.toString(CryptoJS.enc.Utf8);

            depassword !== req.body.password && res.status(401).json("Login Failed: Wrong Login Details");

            const userToken = jwt.sign({
                id: user._id, isAdmin: user.isAdmin, isAgent: user.isAgent
            }, process.env.JWT_SEC);

            const { password, __v, createdAt, ...others } = user._doc;

            res.status(200).json({ ...others, userToken });

        } catch (error) {
            res.status(500)
        }
    }



}