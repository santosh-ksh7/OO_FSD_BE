const sequelize = require("../utils/dbConnection");
const expressValidator = require("express-validator");



// * Get all notes
const getAllNotes = async (req, res, next) => {
    try {
        // ! This is a reference to using where clause using stored procedures
        // * const dbResponse = await sequelize.query("exec getaSingleUser @id=:id", {replacements: {id: 100}});
        console.log("Reaching controller")
        const dbResponse = await sequelize.query("exec getAllNotes");
        if(dbResponse[0]?.length){
            res.status(200).send({data: dbResponse[0]})
        }else{
            res.status(204).send({message: "No Notes Found!"})
        }
    } catch (error) {
        next(error);
    }
}



// * Get a specific note
const getASpecificNote = async(req, res, next) => {
    try {
        const {ticketNo} = req.params
        const dbResponse = await sequelize.query("exec getASingleNote @ticketNo=:ticketNo", {replacements: {ticketNo: ticketNo}})
        if(dbResponse[1]){
            res.status(200).send({data: dbResponse[0][0]})
        }else{
            res.status(204).send({message: "No note available with this identifier."})
        }
    } catch (error) {
        next(error);
    }
}


// * create a new note
const createANewNote = async(req, res, next) => {
    try {
        const expressValidatorError = expressValidator.validationResult(req);
        if(!expressValidatorError.isEmpty()){
            const expressValidatorErrorsArray = expressValidatorError.array();
            const errorMessage = expressValidatorErrorsArray[0].msg
            const myError = new Error(errorMessage);
            myError.statusCode = 422;
            throw myError;
        }else{
            const{title, description, userid} = req.body;
            const dbResponse = await sequelize.query("exec createANewNote @title=:title, @description=:description, @userid=:userid", {replacements: {title: title, description: description, userid: Number(userid)}});
            if(dbResponse[1]){
                res.status(201).send({message: "Note Successfully Created."});
            }else{
                throw new Error("Unable to process the request. Server side error.");
            }
        }
    } catch(error) {
        next(error)
    }
}


// * Edit a note
const editANote = async(req, res, next) => {
    try {
        const expressValidatorError = expressValidator.validationResult(req);
        if(!expressValidatorError.isEmpty()){
            const expressValidatorErrorsArray = expressValidatorError.array();
            const errorMessage = expressValidatorErrorsArray[0].msg
            const myError = new Error(errorMessage);
            myError.statusCode = 422;
            throw myError;
        }else{
            // * Should check first, if a note exists with this identifier
            const{title, status, description, ticketNo, assignedTo} = req.body;
            if(req.name === assignedTo){
                const dbResponse = await sequelize.query("exec editANote @title=:title, @description=:description, @status=:status, @updatedAt=:updatedAt, @ticketNo=:ticketNo", {replacements: {title: title, description: description, status: status === "false" ? 0 : 1, updatedAt: new Date().toString(), ticketNo: ticketNo}});
                if(dbResponse[1]){
                    res.status(201).send({message: "Note Updated Successfully."});
                }else{
                    throw new Error("Unable to process the request. Server side error.");
                }
            }else{
                const myError = new Error("Forbidden. You can only edit a note that belongs to yourself.");
                myError.statusCode = 403;
                throw myError;
            }
        }
    } catch (error) {
        next(error)
    }
}


// * delete a note
const delANote = async(req, res, next) => {
    try{
        const{ticketNo} = req.params;
        // * Should check first, if a note exists with this identifier
        if(req.roles.includes("manager") || req.roles.includes("admin")){
            const dbResponse = await sequelize.query("exec delANote @ticketNo=:ticketNo", {replacements: {ticketNo: Number(ticketNo)}});
            if(dbResponse[1]){
                res.status(200).send({message: "Note Deleted Successfully."});
            }else{
                throw new Error("Unable to process the request. Server side error.");
            }
        }else{
            const myError = new Error("Forbidden. You don't have necessary permissions.");
            myError.statusCode = 403;
            throw myError
        }
    }catch(error){
        next(error)
    }
}



module.exports = {getAllNotes, getASpecificNote, createANewNote, editANote, delANote}