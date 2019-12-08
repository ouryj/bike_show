let express    =  require('express'),
    router     = express.Router(),
    passport   = require('passport'),
    User       = require('../models/user');

    router.get('/',(req,res)=>{
        res.render('../views/bikes/home');
    })
    router.get('/register',(req,res)=>{
        res.render('../views/users/register');
    })
    //register logic handler
    router.post('/register',(req,res)=>{
        User.register(new User({username: req.body.username}),req.body.password,(err,user)=>{
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                passport.authenticate('local')(req,res,function(){
                    res.redirect('/bikes');
                })
            }
        })
    })
    //login routes
    router.get('/login',function(req,res){
        res.render('../views/users/login');
    })
    //login logic handler 
    router.post('/login',passport.authenticate('local',{
        successRedirect: '/bikes',
        failureRedirect: '/login'
    }),function(req,res){});
    //logout route
    router.get('/logout',function(req,res){
        req.logOut();
        req.flash('success','you are successful loged out');
        res.redirect('/');
    })
    

    module.exports = router;