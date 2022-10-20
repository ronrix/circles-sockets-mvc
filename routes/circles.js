const express = require("express");
const router = express.Router();

const CircleController = require("../controllers/circle.controller");

router.get("/", CircleController.index);

module.exports = router;