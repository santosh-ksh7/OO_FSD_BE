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



module.exports = {getAllNotes, getASpecificNote}