const Cate = require("../models/Cate");
const Cart = require("../models/Cart");
const Users = require("../models/User");
class CartController {
  index(req, res) {
    // const id = req.session.authUser;
    const session = req.session.isAuthenticated;
    session &&
      Cate.find(function (err, cates) {
        Users.findById(req.session.authUser._id, function (err, user) {
          const idUser = user.id;
          Cart.find({ userId: idUser }, function (err, carts) {
            if (err) res.send(err);
            cates = cates.map((item) => item.toObject());
            carts = carts.map((item) => item.toObject());
            const pro = carts.map((item) => item.products);
            const product = pro.map(({ productId }) => productId);
            res.send(product);
            // console.log(carts);
            // res.render("cart", {
            //   carts,
            //   cates,
            // });
          });
        });
      });
  }
}
module.exports = new CartController();
