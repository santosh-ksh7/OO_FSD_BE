const path = require("path")

const notFoundController = (req, res) => {
    res.status(404)
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname, "..", "views", "404.html"))
    }else if(req.accepts("json")){
        res.send({msg: "No matching resource found"})
    }
}

module.exports = notFoundController