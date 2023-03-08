const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"]

const corsOptions = {
    origin: (origin, callback) => {
        // TODO: Before Deployement, remeber to remove the !origin check
        // ! In dev. env., Postman, Thunder client there is no origin defined. However, remove !origin in production.
        if(allowedOrigins.includes(origin) || !origin){
            callback(null, true)
        }else{
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,                          
    // ! It sets the Access-Control-Credntials headers in the res. allowing to work with cookies
    optionSuccessStatus: 200
}


module.exports = corsOptions