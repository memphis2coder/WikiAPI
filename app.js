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
// Article is the name of the model
const Article = mongoose.model('Article', articleSchema);

// getting data from mongodb from the collections title of articles
app.route('/articles')
    .get(function (req, res) {
        Article.find(function(err, foundArticles) {
            if (!err) {
                res.send(foundArticles)
            } else {
                res.send(err)
            }
        })
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        
        newArticle.save(function(err) {
            if (!err){
                res.send('Successfully added a new article')
            } else {
                res.send(err)
            }
        })
    })
    .delete(function (req, res) {
        Article.deleteMany(function(err) {
            if (!err) {
                console.log('Successfully deleted article')
            } else {
                res.send(err)
            }
        })
    })

    // route parameters specified field
app.route('/articles/:articleTitle')
    .get(function(req,res) {
        
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("no article with that title was found.")
            }
        }) 
    })
    .put(function(req,res) {
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err) {
                if (!err) {
                    res.send("success update article")
                }
            }
        );
    })
    .patch(function(req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err) {
                if(!err) {
                    console.log('success updated article')
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete(function(req,res) {
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err) {
                if (!err) {
                    console.log("success deleted one")
                } else {
                    console.log(err)
                }
            }
        )
    });



// start server all port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});