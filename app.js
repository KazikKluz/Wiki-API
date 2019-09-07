const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log("no database connection: " + err);
    } else {
        console.log("connection to database established");
    }
});

const articleSchema = new mongoose.Schema(
    {
        title: String,
        content: String
    }
);

const Article = mongoose.model("Article", articleSchema);



app.listen(3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("server started at port 3000");
    }
});

app.get('/', function (req, res) {
    res.render('home');
});

// app.get('/articles');

// app.post('/articles');

// app.delete('/articles');

app.route('/articles')
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (err) {
                res.send(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    .post(function (req, res) {

        const newArticle = new Article(
            {
                title: req.body.title,
                content: req.body.content
            }
        );

        newArticle.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Article added succesfully.");
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Articles deleted succesfully");
            }
        });
    })
    ;

app.route('/articles/:articleTitle')
    .get(function (req, res) {

        Article.findOne({title: req.params.articleTitle},function (err, foundArticle) {
            if (err) {
                res.send("There is an unspecified error");
            } else {
                if(foundArticle){
                    res.send(foundArticle);
                } else {
                    res.send("No article with that title found");
                }
            }
        });
    })

    .put(function(req,res){
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},function(err){
                if(err){
                    console.log(err);
                    res.send("an error occured during updating database");
                } else {
                    res.send("Article updated successfuly");
                }
        });
    })

    .patch(function(req,res){
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Article updated succesfully");
                } else {
                    res.send(err);
                }
            }
        );
    })
;