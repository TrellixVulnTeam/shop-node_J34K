const Product = require("../models/Product");
const Cate = require("../models/Cate");
const Cart = require("../models/Cart");
class ProductController {
  index(req, res) {
    res.render("product-detail");
  }
  product_detail(req, res) {
    console.log(req.params.slug);
    Cate.find(function (err, cates) {
      Product.findOne({ slug: req.params.slug }, function (err, product) {
        if (err) res.send(err);
        cates = cates.map((item) => item.toObject());
        // console.log(cates);

        if (product) {
          product = product.toObject();
        }
        const cateRelated = product.cate;
        // Product.find({ cate: cateRelated }, function (err, productRelated) {
        //   if (err) res.status(404).json(err);
        //   if (productRelated.length <= 1) {
        //     productRelated = [];
        //   } else {
        //     productRelated = productRelated.map((item) => item.toObject());
        //   }
        //   // res.send(productRelated);
        // });
        res.render("product-detail", {
          cates,
          product,
        });
      });
      if (err) res.send(err);
    });
  }
  product_cart(req, res) {
    if (!req.body.id) {
      res.redirect("/login");
    } else {
      const item = {
        userId: req.body.id,
        products: {
          productId: req.body.productId,
          quantity: req.body.number,
        },
      };
      const cart = new Cart(item);
      cart
        .save()
        .then(() => res.redirect("back"))
        .catch((err) => console.log(err));
    }
  }
}

module.exports = new ProductController();
