const express = require("express");
const { signup, signin, signout } = require("../controllers/auth");
const router = express.Router();

// validators
const {
    userSignupValidator,
    validateSignupRequest,
    isRequestValidated,
    validateSigninRequest,
} = require("../validators/auth");
const { runValidation } = require("../validators");

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);
router.get("/signout", signout);
var { expressjwt: jwt } = require("express-jwt");
const { requireSignin } = require("../middleware");

router.get("/secret", requireSignin, (req, res) => {
    res.json({
        message: "you have access to the secret page",
    });
});

module.exports = router;
