const express = require("express");
const router = express.Router();
// TODO: const expressValidator = require("express-validator");
const {getAllNotes} = require("../controller/notesController");


router.route("/")
    .get(getAllNotes)
    .post()
    .patch()
    .delete()


module.exports = router;