const express = require("express");
const router = express.Router();
const { getAllUsers, createNewUser, updateUser, deleteUser, getASingleUser} = require("../controller/userController");
const expressValidator = require("express-validator");
const verifyJWT = require("../middlewares/verifyJWT");



router.use(verifyJWT)

router.route("/")
    .get(getAllUsers)
    .post(
        [
            expressValidator.body("name").custom((value) => {
                if(value){
                    return true
                }else{
                    throw new Error("Name is a required field");
                }
            }),
            expressValidator.body("password", "Password should have a minimum length of 8").isLength({min: 8}).custom((value, {req}) => {
                if(value.includes("!") || value.includes("@") || value.includes("#") || value.includes("$") || value.includes("^")){
                    return true
                }else{
                    throw new Error("Password should contain at least one of the special characters from - !, @, #, $, ^");
                }
            }),
            expressValidator.body("re_password").custom((value, {req}) => {
                if(value === req.body.password){
                    return true
                }else{
                    throw new Error("Both Password should match");
                }
            }),
        ] ,
        createNewUser
    )
    .patch(updateUser)





// * Get a specific User

router.get("/:id", getASingleUser)

router.delete("/delete-user/:id", deleteUser)


module.exports = router;