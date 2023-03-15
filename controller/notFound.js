const notFoundController = (req, res) => {
    res.status(404).send({msg: "No matching resource found"})
}

module.exports = notFoundController