// const shortId = require("shortid");
// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// const expressJwt = require("express-jwt");
// var { expressjwt: expressJwt } = require("express-jwt");
// const { json } = require("body-parser");

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

// exports.signup = (req, res) => {
//     User.findOne({ email: req.body.email }).exec((err, user) => {
//         if (user) {
//             return res.status(400).json({
//                 error: "Email is taken",
//             });
//         }
//     });
//     const { name, email, password } = req.body;
//     let username = shortId.generate();
//     let profile = `${process.env.CLIENT_URL}/profile/${username}`;

//     let newUser = new User({ name, email, password, profile, username });
//     newUser.save((err, success) => {
//         if (err) {
//             return res.status(400).json({ error: err });
//         }
//         // res.json({ user: success });
//         res.json({ message: "Signup process ! Please signin" });
//     });
// };

// exports.signin = (req, res) => {
//     const { email, password } = req.body;
//     // console.log("req body password", password);
//     // check if user exists
//     User.findOne({ email }).exec((err, user) => {
//         console.log("err", err);
//         console.log("user", user);
//         if (err || !user) {
//             return res
//                 .status(400)
//                 .json({ error: "User with that email does not exist" });
//         }
//         // authenticate
//         if (!user.authenticate(req.body.password)) {
//             return res
//                 .status(400)
//                 .json({ error: "Email and Password do not match" });
//         }
//         // generate a token and send to client
//         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//             expiresIn: "1d",
//         });

//         res.cookie("token", token, { expiresIn: "1d" });
//         const { _id, username, name, email, password, role } = user;
//         return res.json({
//             token,
//             user,
//         });
//     });
// };

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
        if (user) {
            return res.status(400).json({
                error: "User already registered",
            });
        }
        const { name, email, password } = req.body;
        const hashed_password = await bcrypt.hash(password, 10);
        const _user = new User({
            name,
            email,
            hashed_password,
            username: shortid.generate(),
        });

        console.log("_user pass", _user.hashed_password);

        _user.save((error, user) => {
            if (error) {
                return res.status(400).json({
                    message: "Something went wrong!!!!",
                    error: error,
                });
            }

            if (user) {
                const token = generateJwtToken(user._id, user.role);
                const { _id, name, email, role, fullName } = user;
                return res.status(201).json({
                    token,
                    user: { _id, name, email },
                });
            }
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
        if (error) return res.status(400).json({ error });
        if (user) {
            const isPassword = await user.authenticate(req.body.password);
            if (isPassword) {
                // const token = jwt.sign(
                //   { _id: user._id, role: user.role },
                //   process.env.JWT_SECRET,
                //   { expiresIn: "1d" }
                // );
                const token = generateJwtToken(user._id);
                const { _id, name, email } = user;
                res.status(200).json({
                    token,
                    user: { _id, name, email },
                });
            } else {
                return res.status(400).json({
                    message: "Something went wrong",
                });
            }
        } else {
            return res
                .status(400)
                .json({ message: "Something went wrong !!!" });
        }
    });
};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Signout success" });
};

// exports.requireSignin = expressJwt({
//     secret: process.env.JWT_SECRET,
// });
