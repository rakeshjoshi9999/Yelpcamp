var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware/");

router.get("/new",function (req,res) {
  Campground.findById(req.params.id,function (err,campground) {
    if (err) {
      console.log("Error in /campgrounds/:id/comments/new:"+err);
    }else {
      res.render("newComment",{campground:campground});
    }
  })
});

router.post("/",middleware.isLoggedIn,function (req,res) {
  Campground.findById(req.params.id,function (err,campground) {
    if(err){
      console.log("Error in /campgrounds/:id/comments:"+err);
      res.redirect("/campgrounds");
    }else {

      Comment.create(req.body.comment,function (err,comment) {
        if(err){
          console.log("Error while adding the comment"+err);
        }else {
          console.log("::::",req.body.comment)
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

//Edit route

router.get("/:comment_id/edit",middleware.checkCommentOwner,function (req,res) {
  Comment.findById(req.params.comment_id, function (err,foundComment) {
      if(err){
        res.redirect("back");
      }else {
        res.render("editComment",{comment:foundComment,campground_id:req.params.id});//from route campgrounds/:id/comment/comment_id/edit
      }
  });
});

router.put("/:comment_id",middleware.checkCommentOwner,function (req,res) {
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,updatedCampground) {
    if(err){
      res.redirect("back");
    }else {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});


// delete commentsc
router.delete("/:comment_id",middleware.checkCommentOwner,function (req,res) {
  Comment.findByIdAndRemove(req.params.comment_id,function (err,deletedComment) {
    if(err){
      res.redirect("back");
    }else {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
})


module.exports = router;
