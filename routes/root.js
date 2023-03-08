const express = require("express");
const rootController = require("../controller/root")


const router = express.Router();

router.get("/", rootController);

module.exports = router;