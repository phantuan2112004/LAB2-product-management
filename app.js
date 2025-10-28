var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var hbs = require("hbs");
var multer = require("multer");
var session = require('express-session');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var categoryRouter = require("./routes/category");
var productRouter = require("./routes/product");
var authRouter = require('./routes/auth');

var app = express();

app.set('view cache', false);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
app.set("upload", upload);

var database = "mongodb://localhost:27017/web";
mongoose
  .connect(database)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

hbs.registerHelper("equals", function (a, b, options) {
  if (a && b && a.toString() === b.toString()) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const timeout = 1000 * 60 * 60 * 24; 
app.use(session({
  secret: "practice_makes_perfect", 
  saveUninitialized: false,
  cookie: { maxAge: timeout },
  resave: false
}));

app.use((req, res, next) => {
  res.locals.username = req.session.username; 
  next();
});


app.use('/auth', authRouter); 
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/users", usersRouter);
app.use("/", indexRouter); 

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;