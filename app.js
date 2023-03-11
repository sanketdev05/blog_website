
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/BlogsDB");

const {Schema} = mongoose;

const blogSchema = new Schema({
  title: String,
  content: String
});

const Blog = mongoose.model("Blog", blogSchema);

const homeContent = new Blog({
  title: "Home",
  content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

const aboutContent = new Blog({
  title: "About",
  content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
});

const contactContent = new Blog({
  title: "Contact",
  content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
});

app.get("/", async (req, res) => {
  const foundItems = await Blog.find({});
  res.render("home", { para: homeContent.content, Post: foundItems});
});

app.get("/about", (req, res) => {
  res.render("about", { para1: aboutContent.content });
});

app.get("/contact", (req, res) => {
  res.render("contact", { para2: contactContent.content });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {

  const newTitle = req.body.blogtitle;
  const newContent = req.body.blogcontent;

  const post = new Blog ({
    title: newTitle,
    content: newContent
  });

  post.save();
  res.redirect("/");
});

app.get("/posts/:topic", async(req, res) => {
  const postparam = _.lowerCase(req.params.topic);

  const posts = await Blog.find({});

  posts.forEach( function(i) {
    const posttitle = _.lowerCase(i._id);

    if (postparam === posttitle){
      res.render("post", {Newpara: i.title, newcontent: i.content });
    }; 
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
