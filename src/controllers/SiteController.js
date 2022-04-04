const Users = require("../models/User");
const bcrypt = require("bcrypt");
const Cate = require("../models/Cate");
const Product = require("../models/Product");
const { $where } = require("../models/User");
const { request } = require("express");
const { response } = require("express");
class SiteController {
  index(req, res) {
    Product.find(function (err, products) {
      Cate.find(function (err, cates) {
        products = products.map((item) => item.toObject());
        cates = cates.map((item) => item.toObject());
        const hotPro = products.filter((item) => item.hot);
        let name;
        if (req.session.authUser) name = req.session.authUser.fullname;
        console.log(name);
        res.render("home", {
          products,
          cates,
          hotPro,
          name,
        });
      });
    });
  }
  login(req, res) {
    Cate.find({}).then((cates) => {
      cates = cates.map((item) => item.toObject());
      let name;
      //   if (req.session.authUser) name = req.session.authUser.fullname;
      //   console.log(req.session.authUser);
      res.render("login", { cates });
      // res.send(cates)
    });
  }
  register(req, res) {
    Cate.find({}).then((cates) => {
      cates = cates.map((item) => item.toObject());

      res.render("register", { cates });
      // res.send(cates)
    });
  }
  async registerAction(req, res) {
    // res.send(req.body)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const newUser = await new Users({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
    });
    newUser
      .save()
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err));
  }
  async loginAction(req, res) {
    // const user = Users.findOne({email: req.body.email})
    // if(!user) res.status(404).json('wrong')

    const user = await Users.findOne({ email: req.body.email });
    if (!user) res.status(404).json("wrong");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(404).json("wrong");
    }
    if (user && validPassword) {
      Product.find(function (err, products) {
        Cate.find(function (err, cates) {
          products = products.map((item) => item.toObject());
          cates = cates.map((item) => item.toObject());
          const hotPro = products.filter((item) => item.hot);
          req.session.isAuthenticated = true;
          req.session.authUser = user;
          res.redirect("/");
        });
      });
    }
  }

  search(req, res) {
    const keywork = req.body.search;
    const newWord = keywork.toUpperCase();

    const condition = new RegExp(`${newWord}`, "");
    Product.find({ name: condition }).then((products) => {
      products = products.map((item) => item.toObject());
      res.render("search", {
        products,
        newWord,
        keywork,
      });
    });
    // res.render("search")
  }
  logOut(req, res) {
    req.session.isAuthenticated = null;
    req.session.authUser = null;
    res.redirect("back");
  }
}

module.exports = new SiteController();
