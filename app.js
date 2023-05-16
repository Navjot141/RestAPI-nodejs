//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
  };
  
  const Article = mongoose.model("Article", articleSchema);

//TODO

app.route('/articles')
        .get(function(request,response){
            Article.find().then(foundArticle => {
            response.send(foundArticle);
            })
            })
        .post(function(req,res) {
            let title = req.body.title;
            let content = req.body.content;
            const article = new Article({
                title: title,
                content: content
            });
            article.save().then(err =>{
            console.log(err);
            });
            })
        .delete(function(req,res){
            let title = req.body.title;
            let content = req.body.content;
            Article.deleteMany().then(err =>{
               if(!err){
                console.log('deleted successfully');
              } else{
                 res.send(err);
             }
            })
        });


        app.route('/articles/:articleTitle')
        .get(function(req,res){
            const title = req.params.articleTitle
            Article.findOne({title: title}).then(foundArticle => {
                if(foundArticle){
                    res.send(foundArticle);
                } else{
                    res.send('No Articles Found')
                }
            })
            })
            .put(function(req,res){
                const title = req.params.articleTitle
                const newTitle = req.body.title
                const newContent = req.body.content
                Article.updateOne({title: title}, {title: newTitle, content:newContent }, {overwrite: true}).then(foundArticle => {
                    if(foundArticle){
                        res.send(foundArticle);
                    } else{
                        res.send('No Articles Found')
                    }
                })
                })
                .patch(function(req,res){
                    const title = req.params.articleTitle
                    const newContent = req.body.content
                    Article.updateOne({title: title}, { content:newContent }).then(foundArticle => {
                        if(foundArticle){
                            res.send(foundArticle);
                        } else{
                            res.send('No Articles Found')
                        }
                    })
                    })
                    .delete(function(req,res){
                        const title = req.params.articleTitle
                        Article.deleteOne({title: title}).then(foundArticle => {
                            if(foundArticle){
                                res.send(foundArticle);
                            } else{
                                res.send('No Articles Found')
                            }
                        })
                        })

        app.listen(3000, function() {
            console.log("Server started on port 3000");
        });
