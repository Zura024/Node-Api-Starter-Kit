const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const JWTStrategy   = passportJWT.Strategy;


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


passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'jwt_secret'
    },
    function (jwtPayload, cb) {
        console.log(jwtPayload);
        //find the user in db if needed
        return User.findOne({id:jwtPayload.__id})
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));

router.post('/login', (req, res,next) => {
    passport.authenticate(
        'local', {
            session:false,
        },(err,user,info)=>{
            if (err || !user){
                return res.json({code : 1});
            }
            req.login(user, {session: false}, (err) => {
                if (err) {
                    res.send(err);
                }
                const token = jwt.sign(user.toObject(),'jwt_secret',{expiresIn: '30m'});
                return res.json({user, token});
            });
        }
    )(req,res,next);
});



//Log Out
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// REGISTER SECTION
router.get('/register', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('AUTHORIZED');
});

module.exports = router;
