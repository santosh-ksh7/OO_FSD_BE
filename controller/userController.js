const bcrypt = require("bcrypt");
const sequelize = require("../utils/dbConnection");



// * Get all users
const getAllUsers = async (req, res, next) => {
    try {
        const dbResponse = await sequelize.query("SELECT id, name, active as status, roles FROM users");
        if(dbResponse?.length){
            res.status(200).send({data: dbResponse})
        }else{
            res.status(204).send({message: "No users found!"})
        }
    } catch (error) {
        next(error);
    }
}


// * Create a new user
const createNewUser = async (req, res) => {
    try{
        
    }catch(error){

    }
}


// * Update an existing user
const updateUser = async (req, res) => {

}


// * Delete an existing user
const deleteUser = async (req, res) => {

}


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}