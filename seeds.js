var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");
var data = [
  {
    name: "Cloud's Rest",
    image:"https://static.pexels.com/photos/14287/pexels-photo-14287.jpeg",
    description:"When their enemies were at the gates the Romans would suspend democracy and appoint one man to protect the city. It wasn't considered an honor, it was a public service.I'll be standing where l belong. Between you and the peopIe of Gotham."
  },
  {
    name: "Sapta Giri",
    image:"https://static.pexels.com/photos/6714/light-forest-trees-morning.jpg",
    description:"When their enemies were at the gates the Romans would suspend democracy and appoint one man to protect the city. It wasn't considered an honor, it was a public service.I'll be standing where l belong. Between you and the peopIe of Gotham."

  },
  {
    name: "Desert Mesa",
    image:"https://static.pexels.com/photos/213807/pexels-photo-213807.jpeg",
    description:"When their enemies were at the gates the Romans would suspend democracy and appoint one man to protect the city. It wasn't considered an honor, it was a public service.I'll be standing where l belong. Between you and the peopIe of Gotham."
  }
];

function seedDB() {
  //remove campgrounds
  Campground.remove({},function (err) {
    if(err){
      console.log(err);
    }
    Comment.remove({},function(err){
      if(err){
        console.log(err);
      }
      console.log("Removed");
      data.forEach(function (seed) {
        Campground.create(seed,function(err,camp){
          if(err){
            console.log(err);
          }else {
            console.log("Added Campground");
            Comment.create(
              {
                text:"This is my first Comment",
                author:"Tom Latham"
              },function (err,comment) {
                if(err){
                  console.log(err);
                }else {
                  camp.comments.push(comment);
                  camp.save();
                  console.log("Added a neew comment");
                }
            });
          }
        });
      })
    })
  });
}

module.exports = seedDB;
