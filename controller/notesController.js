const sequelize = require("../utils/dbConnection");



// * Get all notes
const getAllNotes = async (req, res, next) => {
    try {
        // ! This is a reference to using where clause using stored procedures
        // * const dbResponse = await sequelize.query("exec getaSingleUser @id=:id", {replacements: {id: 100}});
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



module.exports = {getAllNotes}