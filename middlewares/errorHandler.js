const {logEvents} = require("./logger");

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errLog.log");
    console.log(err.satck);
    const status = err.statusCode ? err.statusCode : 500;
    res.status(status).send({message: err.message});
}


module.exports = errorHandler