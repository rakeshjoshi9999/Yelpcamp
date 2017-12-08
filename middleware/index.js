var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

//midlleware

var middlewareObj = {};

middlewareObj.checkCampgroundOwner = function (req,res,next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id,function (err,foundCampground) {
      if (err) {
        res.redirect("/campgrounds");
      }else {
        // is author of  campground and the user is same?
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }else {
          res.redirect("back");
        }
      }
    });
  }else {
    res.redirect("back");
  }

}

middlewareObj.checkCommentOwner = function (req,res,next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id,function (err,foundComment) {
      if (err) {
        res.redirect("/campgrounds");
      }else {
        // is author of  campground and the user is same?
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }else {
          res.redirect("back");
        }
      }
    });
  }else {
    res.redirect("back");
  }

}

middlewareObj.isLoggedIn = function (req,res,next){
  if(req.isAuthenticated()){
    next();
  }else {
    res.redirect("/login");
  }
}

module.exports = middlewareObj;
