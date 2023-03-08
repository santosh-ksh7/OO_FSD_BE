const express = require("express");
const router = express.Router();
const { getAllUsers, createNewUser, updateUser, deleteUser} = require("../controller/userController");
const expressValidator = require("express-validator");


router.route("/")
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser)


module.exports = router;