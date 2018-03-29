const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const home = require('./routes/home/index');
const auth = require('./routes/auth/auth');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
require('./config/config');

const passport = require('passport');



mongoose.Promise = global.Promise;

mongoose.connect(process.env.MongoDburl).then(()=>{
    console.log('DB Connected');
}).catch(err=>{
    console.log(err);
});
app.use(fileUpload());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const {select, GenerateTime,paginate} = require('./helpers/handlebars-helpers');

app.engine('handlebars', exphbs({defaultLayout: 'home',helpers:{select : select, GenerateTime:GenerateTime, paginate:paginate}}));
app.set('view engine','handlebars');


app.use(methodOverride('_method'));

app.use(session({
    secret: 'nodetut',
    resave: true,
    saveUninitialized: true,
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    next();
});

app.use('/', home);
app.use('/auth', auth);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);

const port = process.env.PORT || 9999;
app.listen(port, () => {
    console.log(`app liste ${port} Port`);
});