const path = require("path");

const rootController = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
}

module.exports = rootController