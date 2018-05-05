const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')


// Connecting database
mongoose.connect('mongodb://localhost/nodeapp');
let db = mongoose.connection;

//Check connections
db.once('open',function() {
    console.log('connected to mongo db');
});

// Check for db errors
db.on('error',function() {
  console.log(err);
});

//Init App
const app = express();

//Bring in models
let Article = require('./models/article');

//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

// Public folder for static assets
app.use(express.static(path.join(__dirname,'public')));


// Load View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// Home Route
app.get('/',function(req,res) {
  // res.send('Hello World!');
  //EOM query to find all articles in article collection in mongodb
  Article.find({},function(err,articles) {
    if (err) {
      console.log(err);
    }
    else{
    res.render('index',{
      title:'Hello',
      articles: articles
    });
  }
  });
});

//Get Single articles
app.get('/article/:id',function (req , res) {
  Article.findById(req.params.id, function (err,article) {
    res.render('article',{
      article:article
    });
  });
});

app.get('/articles/add',function (req,res) {
  res.render('add_article',{
    title:'add article'
  });
});

app.post('/articles/add',function(req,res) {
  let article= new Article();
  article.title =req.body.title;
  article.author =req.body.author;
  article.body =req.body.body;
  article.save(function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
        res.redirect('/');
    }
  });
});

//Load EDit Form
app.get('/article/edit/:id',function (req , res) {
  Article.findById(req.params.id, function (err,article) {
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});

// Update Submit POST route
app.post('/articles/edit/:id',function(req,res) {
  let article= {};
  article.title =req.body.title;
  article.author =req.body.author;
  article.body =req.body.body;

  let query={_id:req.params.id}

  Article.update(query, article, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
        res.redirect('/');
    }
  });
});

app.delete('/article/:id',function (req,res) {
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});
// Start Server
app.listen(3000,function () {
  console.log('Server Started on port 3000');
});
