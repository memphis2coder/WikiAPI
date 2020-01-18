//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
// set language to ejs
app.set('view engine', 'ejs');
// request static webpages
app.use(bodyParser.urlencoded({
  extended: true
}));

// files like images and styles
app.use(express.static("public"));

// connection to mongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});
// defining your schema
const articleSchema = {
    title: String,
    content: String
}
// in order to use our schema we need to convert our articleSchema to a MODEL
const Article = mongoose.model('Article', articleSchema);

// getting data from mongodb from the collections title of articles
app.get('/articles', function(req, res) {
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles)
        } else {
            res.send(err)
        }
        
    })
})
// post new data to mongodb
app.post('/articles', function(req,res) {
    console.log(req.body.title)
    console.log(req.body.content)
})

// s
app.listen(3000, function() {
  console.log("Server started on port 3000");
});