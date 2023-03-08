const {v4: uuid} = require("uuid");
const fsPromises = require('fs').promises;
const fs = require("fs");
const path = require("path");

const logEvents = async (message, logFileName) => {
    const dateTime = new Date();
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    try{
        // * check if folder doesn't exist already
        if(!fs.existsSync(path.join(__dirname, "..", "logs"))){
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", logFileName), logItem);
    }catch(error){
        console.log("🚀 ~ file: logger.js:15 ~ logEvents ~ error:", error);
    }
}


const loggerMiddleware = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
    console.log(`🚀 ~ file: logger.js:23 ~ loggerMiddleware ~ ${req.method}, ${req.path}`);
    next();
}


module.exports = {logEvents, loggerMiddleware}