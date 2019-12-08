let express             = require('express'),
    app                 = express(),
    User                = require('./models/user'),
    flash               = require('connect-flash'),
    passport            = require('passport'),
    mongoose            = require('mongoose'),
    bikeRoute           = require('./routes/bike'),
    userRoute           = require('./routes/user'),
    bodyParser          = require('body-parser'),
    commentRoute        = require('./routes/comment'),
    localPassport       = require('passport-local'),
    methodOverRide      = require('method-override');
    //connect database/mongoose
    mongoose.connect('mongodb://localhost:27017/bike_show',{useNewUrlParser:true,useUnifiedTopology:true});
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    //express setup
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.set('view engine','ejs');
    app.use(flash());
    app.use(methodOverRide('_method'));
    //set up session and passport
    app.use(require('express-session')({
        secret: "i hope you know how to ride a bike",
        resave: false,
        saveUninitialized: false
    }))
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localPassport(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    //midleware functions
    app.use(function(req,res,next){
        res.locals.currentUser = req.user;
        res.locals.error       = req.flash('error');
        res.locals.success     = req.flash('success');
        next();
    })

    //routes
    app.use(userRoute);
    app.use(bikeRoute);
    app.use(commentRoute);
    

    //fire up server
    app.listen(3000,function(){
        console.log('they popping a wheely on port 3000');
    })
    