var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

router.get("/new",function (req,res) {
  Campground.findById(req.params.id,function (err,campground) {
    if (err) {
      console.log("Error in /campgrounds/:id/comments/new:"+err);
    }else {
      res.render("newComment",{campground:campground});
    }
  })
});

router.post("/",function (req,res) {
  Campground.findById(req.params.id,function (err,campground) {
    if(err){
      console.log("Error in /campgrounds/:id/comments:"+err);
      res.redirect("/campgrounds");
    }else {

      Comment.create(req.body.comment,function (err,comment) {
        if(err){
          console.log("Error while adding the comment"+err);
        }else {
          //add username and id
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/"+campground._id);
        }
      });
    }
  });
});

//This is called middleware
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
