const express = require("express");
const bodyParser = require("body-parser");          
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true}, function(err){
    if(err){
        console.log("no database connection: "+ err); 
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

const article = new Article(
    {
        title: "Test",
        content: "Karmapa Chenno"
    }
);

// article.save();

app.listen(3000, function(err){
    if(err){
        console.log(err);
    } else {
        console.log("server started at port 3000");
    }
});

app.get('/',function(req, res){
    res.render('home');
});