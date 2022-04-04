const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

router.post("/:slug", productController.product_cart);
router.get("/:slug", productController.product_detail);
router.get("/", productController.index);
module.exports = router;
