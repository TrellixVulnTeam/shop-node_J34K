const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

// router.post("/add-cart", cartController.addCartAction);
router.get("/", cartController.index);
module.exports = router;
