const jwt = require("jsonwebtoken")


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(authHeader?.startsWith("Bearer ")){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if(error){
                res.status(403).send({message: "Forbidden"})
            }else{
                req.id = decoded.userInfo.id;
                req.name = decoded.userInfo.name;
                req.active = decoded.userInfo.active;
                req.roles = decoded.userInfo.roles;
                next();
            }
        })
    }else{
        res.status(401).send({message: "Not Authenticated"})
    }
}


module.exports = verifyJWT