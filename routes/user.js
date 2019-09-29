const express=require('express');
const bcrypt = require('bcryptjs');
const router=express.Router();
const passport=require('passport');

//import mongoose model
const User=require('../models/Person');

//login route
router.get('/login',(req,res)=>{
    res.render('login');
})

//register route
router.get('/register',(req,res)=>{
   res.render('register');
})
//register post route
router.post('/register',(req,res)=>{
    const {name,email,password,password2}=req.body;
    let errors=[];

    if(!name||!email||!password||!password2)
    {
     errors.push({msg:'please enter all the fields'});
    }

    if(password!==password2)
     {
         errors.push({msg:'password do not match'});
     }

     if(password.length<6)
      {
          errors.push({msg:"password has to be atleast 6 charecters"});
      }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
     User.findOne({email:email})
      .then(user=>{
          if(user){
              errors.push({msg:'email is already registered'})
              res.render('register',{
                  errors,
                  name,
                  email,
                  password,
                  password2
              })
          }else{
            const newUser = new User({
                name,
                email,
                password
              });

              bcrypt.genSalt(10,(err,salt)=>{
                  bcrypt.hash(newUser.password,salt,(err,hash)=>{
                      if(err)throw err;
                      newUser.password=hash;
                      newUser.save()
                       .then(user=>{
                        req.flash(
                            'success_msg',
                            'You are now registered and can log in'
                          );
                           res.redirect('/users/login');
                       })
                       .catch(err=>console.log(err))
                  })
              })
          }
      })
      .catch(err=>console.log(err));
    }
})


//login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

//logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','you are logged out');
    res.redirect('/users/login');
});


module.exports=router;
