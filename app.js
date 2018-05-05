const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

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

// Express Session middleware
app.use(session({
  secret:'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req,res,next) {
  res.locals.messages =require('express-messages')(req,res);
  next();
});

// express-validator Middleware
app.use(expressValidator({
  errorFormatter:function (param,msg,value) {
    var namespace =param.split('.'),
    root =namespace.shift(),
    formParam=root;

  while (namespace.length) {
    formParam += '['+namespace.shift()+']';
  }
  return{
    param:formParam,
    msg:msg,
    value :value
  };
}
}))

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

//Route Files
let articles = require('./routes/routes');
app.use('/articles',articles);

// Start Server
app.listen(3000,function () {
  console.log('Server Started on port 3000');
});
