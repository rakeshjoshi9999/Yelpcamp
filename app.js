var express = require("express");
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var expressSession = require("express-session");
var User = require("./models/users");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");

var campgroundRoutes = require("./routes/campground"),
    indexRoutes      = require("./routes/index"),
    commentRoutes    = require("./routes/comment");

var seedDB = require("./seeds");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp",{useMongoClient: true});

// seedDB();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));

// passport Config
app.use(expressSession({
  secret:"This is gonna be the best day of my life",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req,res,next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

// var campgrounds =[
//   {name:"Salmon Creek", image:"https://static.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg"},
//   {name:"Salmon Creek", image:"https://static.pexels.com/photos/14287/pexels-photo-14287.jpeg"},
//   {name:"Salmon Creek", image:"https://static.pexels.com/photos/6714/light-forest-trees-morning.jpg"},
//   {name:"Salmon Creek", image:"https://static.pexels.com/photos/213807/pexels-photo-213807.jpeg"},
//   {name:"Salmon Creek", image:"https://static.pexels.com/photos/111362/pexels-photo-111362.jpeg"}
// ];

//listen
app.listen(3000,function(){
  console.log("Server running on Port 3000");
})
