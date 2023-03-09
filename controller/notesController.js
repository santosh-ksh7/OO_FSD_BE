const sequelize = require("../utils/dbConnection");



// * Get all notes
const getAllNotes = async (req, res, next) => {
    try {
        const dbResponse = await sequelize.query("exec getaSingleUser @id=:id", {replacements: {id: 100}});
        if(dbResponse?.length){
            res.status(200).send({data: dbResponse})
        }else{
            res.status(204).send({message: "No notes found!"})
        }
    } catch (error) {
        next(error);
    }
}



module.exports = {getAllNotes}