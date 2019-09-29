const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const path=require('path');

const app=express();


//port 
const port=process.env.PORT||3000;
//passport config
require('./config/passport')(passport);

//mongodb config
const db=require('./config/keys').mongoUrl;

mongoose.connect(db,{useNewUrlParser:true})
    .then(()=>console.log('mongodb connected successfully'))
    .catch(err=>console.log('mongodb connection error'+err));

//set static path middleware
app.use(express.static(path.join(__dirname,'public')));

//set view engine
app.use(expressLayouts);
app.set('view engine','ejs');

//BodyParser
app.use(express.urlencoded({extended:false}));
//express session
app.use(
    session({
      secret: require('./config/keys').secret,
      resave: true,
      saveUninitialized: true
    })
  );

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global vars
app.use((req,res,next)=>{
   res.locals.success_msg=req.flash('success_msg');
   res.locals.error_msg=req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
});

//route
app.use('/',require('./routes/index.js'));
app.use('/users',require('./routes/user.js'));

app.listen(port,()=>{
    console.log(`The server is running at port ${port}`);
})