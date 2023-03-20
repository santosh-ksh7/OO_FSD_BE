const bcrypt = require("bcrypt");
const sequelize = require("../utils/dbConnection");
const expressValidator = require("express-validator");




// * Get all users
// * access - Private
// * route - /users & GET request
const getAllUsers = async (req, res, next) => {
    try {
        const dbResponse = await sequelize.query("SELECT id, name, active as status, roles FROM users");
        if(dbResponse[0]?.length){
            res.status(200).send({data: dbResponse[0]})
        }else{
            res.status(204).send({message: "No users found!"})
            // This will not send the message part coz 204 status is not chainable. This will only send the status
        }
    } catch (error) {
        next(error);
    }
}


// * Create a new user
// * access - Private
// * route - /users & POST request
const createNewUser = async (req, res, next) => {
    try {
        // * Check for User Input Validation
        const expressValidatorError = expressValidator.validationResult(req);
        if(!expressValidatorError.isEmpty()){
            const expressValidatorErrorsArray = expressValidatorError.array();
            const errorMessage = expressValidatorErrorsArray[0].msg
            const myError = new Error(errorMessage);
            myError.statusCode = 422;
            throw myError;
        }else{
            // * Also can put additional check in backend that only manager and admin can create new user
            // * when there is no validation error
            const name = req.body.name;
            const password = req.body.password;
            const roles = req.body.roles;
            console.log("🚀 ~ file: userController.js:45 ~ createNewUser ~ roles:", roles)
            // * Check if a user with same name already exists or not
            const dbResponse = await sequelize.query("exec findASingleUser @name=:name", {replacements: {name: name}});
            if(dbResponse[0]?.length){
                res.status(406).send({message: "A user with this name already exist. Try different name."})
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const dbResponse = await sequelize.query("exec createANewUser @name=:name, @password=:password, @roles=:roles", {replacements: {name: name, password: hashedPassword, roles: roles}});
                if(dbResponse[1]){
                    res.status(201).send({message: "User Successfully Created."});
                }else{
                    throw new Error("Unable to process the request. Server side error.");
                }
            }
        }
    } catch(error) {
        next(error);
    }
}


// * Update an existing user
const updateUser = async (req, res, next) => {
    try {
        const {id, updatingPassword } = req.body;
        if(req.roles.includes("manager") || req.roles.includes("admin")){
            const findResource = await sequelize.query("exec getaSingleUser @id=:id", {replacements: {id: id}});
            if(findResource[1]){
                const{active, name, roles} = req.body;
                if(updatingPassword === "true"){
                    const{ password } = req.body;
                    const hashedPassword = await bcrypt.hash(password, 10)
                    await sequelize.query("exec editAUserWithPassword @id=:id, @active=:active, @name=:name, @password=:password, @roles=:roles", {replacements: {id: id, name: name, active: active === "false" ? 0 : 1, roles: roles, password: hashedPassword}});
                    res.status(200).send({message: "Successfully Updated the User"})
                }else{
                    await sequelize.query("exec editAUserWithOutPassword @id=:id, @active=:active, @name=:name, @roles=:roles", {replacements: {id: id, name: name, active: active === "false" ? 0 : 1, roles: roles}});
                    res.status(200).send({message: "Successfully Updated the User"})
                }
            }else{
                const myError = new Error("No resource exists with this identifier");
                myError.statusCode = 404;
                throw myError
            }
        }else{
            const myError = new Error("Forbidden. You do not have necessary permission to perform this operation");
            myError.statusCode = 403;
            throw myError
        }
    } catch (error) {
        next(error)
    }
}




// * Delete an existing user
const deleteUser = async (req, res, next) => {
    try {
        // * Additional check to put, The same user can't delete himself
        if(req.roles.includes("manager") || req.roles.includes(admin)){
            const {id} = req.params
            console.log("🚀 ~ file: userController.js:78 ~ deleteUser ~ id:", id)
            const dbResponse = await sequelize.query("exec getaSingleUser @id=:id", {replacements: {id: id}});
            if(dbResponse[1]){
                const checkAssignedNotes = await sequelize.query("exec getAllNotesBelongingToAUser @userid=:userid", {replacements: {userid: id}});
                if(checkAssignedNotes[1]){
                    const myError = new Error("The Notes are currently assigned to user. Delete all notes assigned to this user first.");
                    myError.statusCode = 400;
                    throw myError
                }else{
                    await sequelize.query("exec delAUser @id=:id", {replacements: {id: Number(id)}});
                    res.status(200).send({message: "User Successfully deleted"})
                }
            }else{
                const myError = new Error("No User with the identifier found");
                myError.statusCode = 404;
                throw myError
            }
        }else{
            const myError = new Error("You don't have valid persmission to perform the requets");
            myError.statusCode = 403;
            throw myError
        }
    } catch(error) {
        next(error);
    }
}


// * Get a specific user based on their id
const getASingleUser = async (req, res) => {
    try {
        const {id} = req.params;
        const dbResponse = await sequelize.query("exec getaSingleUser @id=:id", {replacements: {id: id}});
        if(dbResponse[0]?.length){
            res.status(200).send({data: dbResponse[0][0]})
        }else{
            res.status(204).send({message: "No user with this identifier found!"})
            // This will not send the message part coz 204 status is not chainable. This will only send the status
        }
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getASingleUser
}