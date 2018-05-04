const express = require('express');
const path = require('path');

//Init App
const app = express();

// Load View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// Home Route
app.get('/',function(req,res) {
  // res.send('Hello World!');
  res.render('index',{
    title:'Hello'
  });
});

app.get('/articles/add',function (req,res) {
  res.render('add_article',{
    title:'add article'
  });
});
// Start Server
app.listen(3000,function () {
  console.log('Server Started on port 3000');
});
