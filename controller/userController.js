const bcrypt = require("bcrypt");
const sequelize = require("../utils/dbConnection");



// * Get all users
const getAllUsers = async (req, res) => {
    try {
        const dbResponse = await sequelize.query("SELECT ")
    } catch (error) {
        
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