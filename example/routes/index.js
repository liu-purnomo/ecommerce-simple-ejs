const express = require("express");
const router = express.Router();
const Controller = require("../controllers/index");

router.get("/", Controller.index);
router.get("/add-product", Controller.add);
router.post("/add-product", Controller.addProduct);
router.get("/buy/:id", Controller.edit);

module.exports = router;
