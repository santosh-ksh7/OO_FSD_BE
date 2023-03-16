const express = require("express");
const router = express.Router();
const loginLimiter = require("../middlewares/loginLimiter");
const { loginController, logoutController, refreshController } = require("../controller/authController")
// TODO: Implement the express validator middleware
const expressValidator = require("express-validator");


router.route("/login")
    .post(
        [
            expressValidator.body("name").custom((value) => {
                if(value){
                    return true
                }else{
                    throw new Error("Name is a required field")
                }
            }),
            expressValidator.body("password", "Password should have a minimum length of 8").isLength({min: 8}).custom((value) => {
                if(value.includes("!") || value.includes("@") || value.includes("#") || value.includes("$") || value.includes("^")){
                    return true
                }else{
                    throw new Error("Password should contain at least one of the special characters from - !, @, #, $, ^");
                }
            })
        ],
        loginLimiter,
        loginController
    )

router.route("/refresh")
    .get(refreshController)

router.route("/logout")
    .post(logoutController)



module.exports = router;