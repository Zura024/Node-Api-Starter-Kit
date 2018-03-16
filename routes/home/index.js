const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'home';
    next();
});


router.get('/', (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    const promises = [
        Post.find({}).skip((perPage * page) - perPage).limit(perPage).exec(),
        Post.count().exec(),
        Category.find({}).exec(),
    ];

    Promise.all(promises).then(([posts,postCount,categories])=>{
        res.render('home/index',
            {
                posts : posts,
                categories : categories,
                current : parseInt(page),
                pages: Math.ceil(postCount/perPage)
            });
    });
});

router.get('/post/:slug', (req, res) => {
    let slug = req.params.slug;
    Post.findOne({slug:slug})
        .populate({path : 'comments', match:{ approveComment:true}, populate : {path:'user' , model :'users' }})
        .populate('user')
        .then(post=>{
        res.render('home/post',{post : post});
    }).catch(err=>{

    });
});

router.get('/about', (req, res) => {
    res.render('home/about');
});

// LOGIN SECTION

passport.use(new LocalStrategy({usernameField : 'email'},(email, password, done)=>{
        User.findOne({ email: email }, (err, user)=>{
            if (err) return done(err)
            if (!user) return done(null, false, { message: 'Incorrect username.' });

            bcrypt.compare(password,user.password,(err,match)=>{
                if (err) return err;
                if (match){
                    return done(null, user);
                }else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });

        });
    }
));

passport.serializeUser((user, done)=> {
    done(null, user.id);
});

passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user)=> {
        done(err, user);
    });
});

router.get('/login', (req, res) => {
    res.render('home/login');
});

router.post('/login', (req, res,next) => {
    passport.authenticate(
        'local', {
            successRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true
        }
    )(req,res,next);
    //res.send(req.body);
});


// END LOGIN

//Log Out
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// REGISTER SECTION
router.get('/register', (req, res) => {
    res.render('home/register');
});

router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password !== req.body.passwordConfirm){
        errors.push(({message:"Password does not match"}))
    }

    User.findOne({email:req.body.email}).then(user=>{
        if (user){
            errors.push(({message:"User already exist"}))
        }
    });

    if (errors.length > 0){
        res.render('home/register',{
            errors:errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        });
    }else{
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                newUser.password = hash;

                newUser.save().then(u=>{
                    req.flash('success_message', `User ${u.firstName} ${u.lastName} Saved successfully `);
                    res.redirect('/login');
                }).catch(err=>{
                    res.render('home/register',{errors : err})
                });
            });
        });
    }
});



module.exports = router;
