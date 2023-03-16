const express = require("express");
const router = express.Router();
// TODO: const expressValidator = require("express-validator");
const {getAllNotes, getASpecificNote} = require("../controller/notesController");
const verifyJWT = require("../middlewares/verifyJWT")


router.use(verifyJWT)

router.route("/")
    .get(getAllNotes)
    .post()
    .patch()
    .delete()



router.get("/specific-note/:ticketNo", getASpecificNote)


module.exports = router;