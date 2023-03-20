const express = require("express");
const router = express.Router();
// TODO: const expressValidator = require("express-validator");
const expressValidator = require("express-validator");
const {getAllNotes, getASpecificNote, createANewNote, editANote, delANote} = require("../controller/notesController");
const verifyJWT = require("../middlewares/verifyJWT")


router.use(verifyJWT)

router.route("/")
    .get(getAllNotes)
    .post(
        [
            expressValidator.body("title").custom((value) => {
                if(value){
                    return true
                }else{
                    throw new Error("Title is a required field");
                }
            }),
            expressValidator.body("description").custom((value) => {
                if(value){
                    return true
                }else{
                    throw new Error("Description is a required field");
                }
            }),
            expressValidator.body("userid").custom((value) => {
                if(value){
                    return true
                }else{
                    throw new Error("Notes must be assigned to a user");
                }
            }),
        ],
        createANewNote
    )
    .patch(
        [
            expressValidator.body("title").custom((value) => {
                if(value){
                    return true
                }else{
                    throw new Error("Title is a required field");
                }
            }),
            expressValidator.body("description").custom((value) => {
                if(value){
                    return true
                }else{
                    throw new Error("Description is a required field");
                }
            }),
            expressValidator.body("status").custom((value) => {
                if(value){
                    return true
                }else{
                    throw new Error("Notes must be assigned to a user");
                }
            }),
            expressValidator.body("ticketNo").custom((value) => {
                if(value){
                    return true
                }else{
                    throw new Error("Note has to have a unique identifier");
                }
            }),
            expressValidator.body("assignedTo").custom((value) => {
                if(value){
                    return true
                }else{
                    throw new Error("Note has to be assigned to a user");
                }
            }),
        ],
        editANote
    )
    



router.get("/specific-note/:ticketNo", getASpecificNote)

router.delete("/del-note/:ticketNo", delANote)


module.exports = router;