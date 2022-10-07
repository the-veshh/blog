const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

// Rendering home starting content.
const homeStartingContent = "Welcome MSITian's, feel free to go through the experiences of your fellow seniors and don't forget to add your experiences that might help someone, someday, standing in your shoes.";

// Calls the express function and puts new Express application inside the app variable.
// express is like class and app is like an object.
const app = express();

// By default express will look in views folder for template files.
app.set('view engine', 'ejs');

// Setting body-parser to look inside body.
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Setting up connection with database.
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

// Creating the schema.
const postSchema = {
  title: String,
  content: String
};

// Creates a collection.
const Post = mongoose.model("Post", postSchema);

// Renders home page.
app.get('/', function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

// Renders about page.
app.get('/about', function(req, res) {  
  res.render('about');
})

// Renders contact page.
app.get('/contact', function(req, res) {
  res.render('contact');
})

// Renders compose page.
app.get('/compose', function(req, res) {
  res.render('compose');
})

// Renders page with post-title.
app.get('/posts/:postTitle', function(req, res) {
  const requestedPostTitle = req.params.postTitle;
  
  Post.findOne({title: requestedPostTitle}, function(err, post){
    if(!err) {
      res.render("post", {
        post:post
      });
    } else {
      console.log(err);
    }
 });
})

// Gets the post entered by user and insert into database.
app.post('/compose', function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if(!err) {
      res.redirect("/");
    }
  });
})


// Connecting with local server and listen on port 3000 for connections.
app.listen(3000, function() {
  console.log("Server started on port 3000");
});