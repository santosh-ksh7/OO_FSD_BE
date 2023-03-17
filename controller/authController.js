const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const expressValidator = require("express-validator");
const sequelize = require("../utils/dbConnection");



const loginController = async (req, res, next) => {
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
            // * No validation error logic block
            const name = req.body.name;
            const password = req.body.password;
            // * Check if a user with same name already exists or not
            const dbResponse = await sequelize.query("exec findASingleUserWithAllFields @name=:name", {replacements: {name: name}});
            if(dbResponse[1] && dbResponse[0][0].active){
                const verifyPassword = await bcrypt.compare(password, dbResponse[0][0].password);
                if(verifyPassword){
                    // * Create Access Token
                    const accessToken = jwt.sign(
                        {
                            userInfo: {
                                id: dbResponse[0][0].id,
                                name: dbResponse[0][0].name,
                                active: dbResponse[0][0].active,
                                roles: dbResponse[0][0].roles
                            },
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: "1m"
                        }
                    )
                    // * Create Refresh Token
                    const refreshToken = jwt.sign(
                        {
                            userInfo: {
                                id: dbResponse[0][0].id,
                                name: dbResponse[0][0].name,
                                active: dbResponse[0][0].active,
                                roles: dbResponse[0][0].roles
                            },
                        },
                        process.env.REFRESH_TOKEN_SECRET,
                        {
                            expiresIn: "10m"
                        }
                    )
                    // * Set refreshToken as a secure cookie (Not accessible via JS)
                    res.cookie("jwt", refreshToken, {
                        httpOnly: true, 
                        secure: true, 
                        sameSite: 'None', 
                        maxAge: 10 * 60 * 1000
                    })
                    res.status(200).send({message: "Logged In Successfully", accessToken, roles: dbResponse[0][0].roles})
                }else{
                    const myError = new Error("Invalid Credentials");
                    myError.statusCode = 406
                    throw myError
                }
            }else{
                const myError = new Error("Invalid Credentials");
                myError.statusCode = 406
                throw myError
            }
        }
    } catch (error) {
        next(error);
    }
}


const refreshController = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if(cookies?.jwt){
            const refreshToken = cookies.jwt;
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (error, decoded) => {
                if(error){
                    const myError = new Error("Forbidden");
                    myError.statusCode = 403
                    throw myError
                }else{
                    const dbResponse = await sequelize.query("exec findASingleUserWithAllFields @name=:name", {replacements: {name: decoded.userInfo.name}});
                    if(dbResponse[1]){
                        const acessToken = jwt.sign(
                            {
                                userInfo: {
                                    id: dbResponse[0][0].id,
                                    name: dbResponse[0][0].name,
                                    active: dbResponse[0][0].active,
                                    roles: dbResponse[0][0].roles
                                },
                            },
                            process.env.ACCESS_TOKEN_SECRET,
                            {
                                expiresIn: "1m"
                            }
                        )
                        res.status(200).send({message: "Successfully got the new access Token", acessToken})
                    }else{
                        const myError = new Error("Not Authorized");
                        myError.statusCode = 401
                        throw myError
                    }
                }
            })
        }else{
            const myError = new Error("Not Authorized");
            myError.statusCode = 401
            throw myError
        }
    } catch (error) {
        next(error);
    }
}


const logoutController = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if(cookies?.jwt){
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "None",
                secure: true
            })
            res.status(200).send({message: "Logged out successfully"})
        }else{
            res.status(204).send({message: "Logged ou successfully"})
        }
    } catch (error) {
        next(error)
    }
}


module.exports = {
    loginController,
    logoutController,
    refreshController
}


// FIXME: Wherever you are using status code of 204, use sendStatus(204). It is not chainable if you only res.send(204), it will be treated as a pending n/w request.