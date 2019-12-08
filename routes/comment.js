let express = require('express'),
    Comment = require('../models/comment'),
    router  = express.Router(),
    Bike    = require('../models/bike'),
    mid     = require('../middleware/index');
    
    //new routes
    router.get('/bikes/:id/comments/new',function(req,res){
        Bike.findById(req.params.id,(err,bike)=>{
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.render('../views/comments/new',{bike:bike});
            }
        })
    })
    //create route
    router.post('/bikes/:id/comments',function(req,res){
        Bike.findById(req.params.id,(err,bike)=>{
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                let author = {id:req.user._id,username:req.user.username};
                let newComment = new Comment({text:req.body.text,author:author});
                Comment.create(newComment,function(err,comment){
                    if(err){
                        console.log(err);
                        req.flash('error',err.message);
                        res.redirect('back');
                    }else{
                        bike.comments.push(comment);
                        bike.save();
                        res.redirect('/bikes/'+req.params.id);
                    }
                })
            }
        })
    })
    //edit route
    router.get('/bikes/:id/comments/:comment_id/edit',mid.commentOwner,function(req,res){
        Bike.findById(req.params.id,function(err,bike){
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                Comment.findById(req.params.comment_id,(err,comment)=>{
                    if(err){
                        console.log(err);
                        req.flash('error',err.message);
                        res.redirect('back');
                    }else{
                        res.render('../views/comments/edit',{bike:bike,comment:comment});
                    }
                })
            }
        })
    })
    // update route
    router.put('/bikes/:id/comments/:comment_id',mid.commentOwner,function(req,res){
        Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err)=>{
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.redirect('/bikes/'+req.params.id);
            }
        })
    })
    //delete comment
    router.delete('/bikes/:id/comments/:comment_id',function(req,res){
        Comment.findByIdAndDelete(req.params.comment_id,function(err){
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.redirect('/bikes/'+req.params.id);
            }
        })
    })

    module.exports = router;

