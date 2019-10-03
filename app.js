const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//connect to database

mongoose.connect('mongodb://localhost/nodekb', {
    useNewUrlParser: true
});

let db = mongoose.connection;

//check connection
db.once('open',function(){
  console.log('Connected to MongoDB');
})

//check for db errors
db.on('error',function(err){
  console.log(err);
});

//Init app
const app = express();

//Bring in models
let Thread = require('./models/thread');

let Users = require('./models/user');

//Load view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parse --- Middleware
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

//Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Home route
app.get('/', function(req, res){
  res.render('index', {
    title:'codeSolutions'
  });
});

//Register route
app.get('/codesolutions/register', function(req, res){
  res.render('register_user', {
    title:'Register Your Account'
  });
});

//Login route
app.get('/codesolutions/login', function(req, res){
  res.render('login_user', {
    title:'Login To Your Account'
  });
});


//Forums route

app.get('/codesolutions/forums', function(req, res){
  Thread.find({},function(err, forum){
    if(err){
      console.log(err);
    }else {
      res.render('forums', {
        title:'Forums',
        forums: forum
      });
    }
  });
});

// Get single Thread
app.get('/codesolutions/forums/:id', function(req, res){
  Thread.findById(req.params.id, function(err, thread){
    res.render('Thread', {
      thread:thread
    });
  });
});


//Add thread

app.get('/codesolutions/forums/thread/add', function(req, res){
  res.render('create_thread', {
    title:'Create a thread'
  });
});

// Submit forum route
app.post('/forums/add', function(req, res){
  let thread = new Thread();
  thread.title = req.body.title;
  thread.author = req.body.author;
  thread.body = req.body.body;

  thread.save(function(err){
    if (err) {
      console.log(err);
      return
    }
    else{
      res.redirect('/codesolutions/forums');
    }
  });
});

//update forum thread
app.post('/thread/edit/:id', function(req, res){
  let thread = {};
  thread.title = req.body.title;
  thread.author = req.body.author;
  thread.body = req.body.body;

  let query = {_id:req.params.id}

  Thread.update(query, thread, function(err){
    if (err) {
      console.log(err);
      return
    }
    else{
      res.redirect('/codesolutions/forums');
    }
  });
});

//delete thread function
app.delete('/forums/:id', function(req, res){
  let query = {_id:req.params.id}

  Thread.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Successful');
  });

});

//Load edit forum thread
app.get('/thread/edit/:id', function(req, res){
  Thread.findById(req.params.id, function(err, thread){
    res.render('edit_thread', {

      thread:thread
    });
  });
});

//Submit account registeration
app.post('/users/add', function(req, res){
  let user = new Users();
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;

  user.save(function(err){
    if (err) {
      console.log(err);
      return
    }
    else{
      res.redirect('/codesolutions/login');
    }
  });
});


//Start server
app.listen(3000, function(){
  console.log('Server started on port 3000!');
});
