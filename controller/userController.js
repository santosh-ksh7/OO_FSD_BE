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
            // * when there is no validation error
            const name = req.body.name;
            const password = req.body.password;
            const roles = req.body.roles;
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
    
}


// * Delete an existing user
const deleteUser = async (req, res) => {

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