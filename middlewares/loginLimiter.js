const rateLimit = require("express-rate-limit");
const {logEvents} = require("./logger")


const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // Setting time to 1 minute
    max: 5, // Limit login attempt from a specific IP to 5
    message:
        { message: 'Too many requests from this IP, please try again after a minute pause' },
    // Handler defines what happens when the limit is reached
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})



module.exports = loginLimiter