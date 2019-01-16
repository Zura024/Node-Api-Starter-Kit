const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');
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

passport.serializeUser((user, done)=> {
    done(null, user.id);
});

passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user)=> {
        done(err, user);
    });
});