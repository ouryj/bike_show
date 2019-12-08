let Bike   = require('../models/bike'),
    Comment = require('../models/comment');

    let check = {};

    check.isAuth = function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/login');
        }
    }
    //bike ownership
    check.bikeOwner = function(req,res,next){
        if(req.isAuthenticated()){
            Bike.findById(req.params.id,(err,bike)=>{
                if(err){
                    console.log(err);
                    req.flash('error',err.message);
                    res.redirect("back");
                }else if(bike.author.id.equals(req.user._id)){
                    return next();
                } else {
                    req.flash('error','sorry you are not authorized to alter that');
                    res.redirect('back');
                }
            })

        }else{
            res.redirect('/login')
        }
    }
    //comment owner
    check.commentOwner = function(req,res,next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id,(err,comment)=>{
                if(err){
                    req.flash('error',err.message);
                    res.redirect('back');
                }else if(comment.author.id.equals(req.user._id)){
                    return next();
                }else{
                    req.flash('error','you do not own that comment');
                    res.redirect('back');
                }
            })
        }else{
            res.redirect('/login');
        }
    }

    module.exports = check;