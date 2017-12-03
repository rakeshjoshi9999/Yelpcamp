var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

router.get("/",isLoggedIn,function (req,res) {
  //get all the campgrounds from db
  Campground.find({},function(err,data){
    if(err){
      console.log(err);
    }else {
      res.render("index",{campgrounds:data});
    }
  })
})
//
router.post("/",isLoggedIn,function (req,res) {
//get data from form
// var name = req.body.name;
// var imageURL = req.body.image;
// var description = req.body.description;
// var newCamp = {name:name , image: imageURL,description };
var author = {
  id:req.user._id,
  username:req.user.username
}
var campground = req.body.campground;
campground.author = author;
Campground.create(campground,function (err,campground) {
  if(err){
    console.log(err);
  }else {
    console.log(req.body.campground);
    res.redirect("/campgrounds");
  }
  });
});

router.get("/new",isLoggedIn,function(req,res){
  res.render("new");
});

//show more info about the one campground
router.get("/:id",isLoggedIn,function (req,res) {
  //find the campground with provided Id
  Campground.findById(req.params.id).populate("comments").exec(function (err,data) {
    if(err){
      console.log(err);
    }else{
        //render
        console.log(data);
      res.render("show",{campground:data});
    }
  });
});

// edit campground
router.get("/:id/edit",function (req,res) {
  Campground.findById(req.params.id,function (err,foundCampground) {
    // is user logged in?
    if(req.isAuthenticated()){
      
    }else{
        res.send("You are not logged in...!");
    }
    if (err) {
      res.redirect("/campgrounds");
    }else {
      res.render("edit",{campground: foundCampground});
    }
  })
});

router.put("/:id",isLoggedIn,function (req,res) {
Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err,updatedCampground) {
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }else {
      res.redirect("/campgrounds/"+ req.params.id);
    }
  });
});

//Destroy campground
router.delete("/:id",isLoggedIn,function (req,res) {
  Campground.findByIdAndRemove(req.params.id,function (err) {
      if(err){
        console.log(err);
        res.redirect("/campgrounds");
      }
      console.log(req.params);
      Comment.findByIdAndRemove(req.params.id,function(err){
        if(err){
          console.log(err);
        }else {
        res.redirect("/campgrounds");
      }
    });
  });
});

//This is called middlewareFunction
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
