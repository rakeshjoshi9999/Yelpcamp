var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware");

router.get("/",middleware.isLoggedIn,function (req,res) {
  //get all the campgrounds from db
  Campground.find({},function(err,data){
    if(err){
      console.log(err);
    }else {
      res.render("index",{campgrounds:data});
    }
  })
});

router.get("/new",middleware.isLoggedIn,function(req,res){
  res.render("new");
});

router.post("/",middleware.isLoggedIn,function (req,res) {
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

//show more info about the one campground
router.get("/:id",middleware.isLoggedIn,function (req,res) {
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
router.get("/:id/edit",middleware.checkCampgroundOwner,function (req,res) {
    Campground.findById(req.params.id,function (err,foundCampground) {
          res.render("edit",{campground: foundCampground});
    });
});
router.put("/:id",middleware.checkCampgroundOwner,function (req,res) {
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
router.delete("/:id",middleware.checkCampgroundOwner,function (req,res) {
  Campground.findByIdAndRemove(req.params.id,function (err) {
      if(err){
        console.log(err);
        res.redirect("/campgrounds");
      }else {
        res.redirect("/campgrounds");
      }
    });
  });

module.exports = router;
