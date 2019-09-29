const express=require('express');
const router=express.Router();
const { ensureAuthenticated} = require('../config/auth');

router.get('/',(req,res)=>{
    res.render('welcome');
})

//Dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        name:req.user.name
    });
})

//product
router.get('/product',ensureAuthenticated,(req,res)=>{
    res.render('product');
})
//customer views
router.get('/customerview',ensureAuthenticated,(req,res)=>{
    res.render('customerview');
})

module.exports=router;