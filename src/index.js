const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const port = 3000;
const path = require("path");
const route = require("./routers");
const session = require("express-session");
const app = express();
const db = require("./config/db");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const methodOverride = require("method-override");
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "resources/public")));
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
    },
  })
);
app.use(methodOverride("_method"));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));
db.connect();

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(async function (req, res, next) {
  if (!req.session.authUser) {
    req.session.isAuthenticated = false;
  }
  res.locals.lcIsAuthenticated = req.session.isAuthenticated;
  res.locals.lcAuthUser = req.session.authUser;
  next();
});

//Google
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// app.use(
//   session({
//     resave: false,
//     saveUninitialized: true,
//     secret: "SECRET",
//   })
// );

let userProfile;
const model = require("./models/User");
app.get("/google", async function (req, res) {
  let user;
  if (userProfile) user = await model.findOne({ email: userProfile.email });
  if (user) {
    req.session.isAuthenticated = true;
    req.session.authUser = user;
    res.redirect("/");
  } else {
    const profile = {
      fullname: userProfile.displayName,
      email: userProfile.email,
      password: "",
      phone: "",
    };
    const newUser = new model(profile);
    await newUser.save();
    req.session.isAuthenticated = true;
    const currentUser = await model.findOne({ email: newUser.email });

    console.log(currentUser);
    req.session.authUser = currentUser;
    res.redirect("/");
  }
});
app.get("/error", (req, res) => res.send("error logging in"));

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "595982030992-6qgbk9894bohvk96gpfu60njnth29q0o.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://hnam.com:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  async function (req, res) {
    res.redirect("/google");
  }
);

// facebook
const FacebookStrategy = require("passport-facebook").Strategy;

var userFacebook;
var email;
app.use(passport.initialize());
app.use(passport.session());
app.get("/facebook", async function (req, res) {
  const rows = await model.taikhoan(email);
  const gt = rows[0];
  if (gt != null) {
    req.session.isAuthenticated = true;
    req.session.authUser = gt;
    res.redirect("/");
  } else {
    const newU = {
      KH_hoten: userFacebook.displayName,
      KH_email: userFacebook.emails[0].value,
      KH_tendangnhap: userFacebook.emails[0].value,
      KH_matkhau: "",
      KH_sodienthoai: "",
    };
    await model.add(newU);
    req.session.isAuthenticated = true;
    const r = await model.taikhoan(newU.KH_email);
    const n = r[0];
    req.session.authUser = n;
    res.redirect("/");
  }
});
passport.use(
  new FacebookStrategy(
    {
      clientID: "3069289023332598",
      clientSecret: "a27faca88898cdca865bce2e24f76dae",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "email",
        "first_name",
        "last_name",
        "middle_name",
      ],
    },
    async function (accessToken, refreshToken, profile, done) {
      process.nextTick(async function (req, res) {
        userFacebook = profile;
        email = userFacebook.emails[0].value;
        return done(null, userFacebook);
      });
    }
  )
);
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/error" }),
  function (req, res) {
    res.redirect("/facebook");
  }
);

route(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
