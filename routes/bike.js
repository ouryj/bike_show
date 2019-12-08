let express = require('express'),
    Comment = require('../models/comment'),
    router  = express.Router(),
    Bike    = require('../models/bike'),
    mid     = require('../middleware/index');
    
    router.get('/bikes',mid.isAuth,function(req,res){
        Bike.find({},(err,bikes)=>{
            if(err){
                console.log(err);
                res.redirect('back');
            }else{
                res.render('../views/bikes/index',{bikes:bikes});
            }
        })
    })
    //new route 
    router.get('/bikes/new',function(req,res){
        res.render('../views/bikes/new');
    })
    //create route
    router.post('/bikes',function(req,res){
        let author = {
            id: req.user._id, username: req.user.username
        };
        let newBike = new Bike({name:req.body.name,model:req.body.model,image:req.body.image,author:author});
        Bike.create(newBike,(err,bike)=>{
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.redirect('/bikes');
            }
        })

    })
    //show route
    router.get('/bikes/:id',function(req,res){
        Bike.findById(req.params.id).populate('comments').exec((err,bike)=>{
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
                
            }else{
                res.render('../views/bikes/show',{bike:bike});
            }
        })
    })
    //edit route
    router.get('/bikes/:id/edit',mid.bikeOwner,function(req,res){
        Bike.findById(req.params.id,(err,bike)=>{
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.render("../views/bikes/edit",{bike:bike});
            }
        })
    })
    //update route
    router.put('/bikes/:id',function(req,res){
        Bike.findByIdAndUpdate(req.params.id,req.body.bike,(err)=>{
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.redirect('/bikes/'+req.params.id);
            }
        })
    })
    //delete route
    router.delete('/bikes/:id',mid.bikeOwner,function(req,res){
        Bike.findByIdAndRemove(req.params.id,function(err,bike){
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                Comment.remove({_id: {$in: bike.comments}},function(err){
                    if(err){
                        console.log(err);
                        req.flash('error',err.message);
                        res.redirect('/bikes');
                    }
                })
                res.redirect('/bikes');
            }
        })
    })
     
    module.exports = router;