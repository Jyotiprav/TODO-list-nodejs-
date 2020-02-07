//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
// Mongoose require
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs"); //to include templates use ejs, this directly searches for views folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
})); //for getting the values from html page
//Database coding
mongoose.connect("mongodb://Localhost:27017/todolistDB", {
  useUnifiedTopology: true
});
const itemsSchema = {
  name: String
};
// schema for custom lists
const listschema={
  name: String,
  items:[itemsSchema]
};
//create model based on above itemsSchema
const Item = mongoose.model("Items", itemsSchema);
const List=mongoose.model("List", listschema);
//create three new documents using mongoose
const item1 = new Item({
  name: "Welcome1"
});
const item2 = new Item({
  name: "Welcome2"
});
const item3 = new Item({
  name: "Welcome3"
});
const defaultitem = [item1, item2, item3];

//Home page
app.get("/", function(req, res) {
  //CODE FOR GETTING THE DATE
  //============================================
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  var day = today.toLocaleDateString("en-US", options);
  //============================================
  //CODE FOR GETTING DATA FROM Database
  //============================================
  Item.find({}, function(er, founditems) {
    if (founditems.length == 0) {
      Item.insertMany(defaultitem, function(er) {
        if (er) {
          console.log(er);
        } else {
          console.log("Success");
        }

      });
      res.redirect("/");
    } else {
      res.render("list", {
        "day": day,
        "newitem": founditems
      });
    }


  });

});
//POST FUNTCION
app.post("/", function(req, res) {
  const item = req.body.newitem;
  const item1 = new Item({
    name: item
  });
  item1.save()
  res.redirect("/");
});

//DELETE function
app.post("/delete", function(req, res) {
  const ID = req.body.checkbox;
  Item.findByIdAndRemove(ID, function(er) {
    if (er) {
      console.log(er);
    } else {
      console.log("Success delete");
    }
  });
  res.redirect("/");
});

//Custom lists using ejs
app.get("/:customlistname", function(req, res) {
  const name=req.params.customlistname;
  const list=new List({
    name:name,
    items:defaultitem
  });
  list.save();
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
