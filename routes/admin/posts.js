const express = require('express');
const router = express.Router();
const fileExists = require('file-exists');
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const {isEmpty,uploadDir } = require('../../helpers/uploadHelper');
const fs = require('fs');

router.all('/*',(req,res,next)=>{
   req.app.locals.layout = 'admin';
   next();
});

router.get('/', (req, res) => {
    Post.find({}).populate('category').then(posts=>{
        res.render('admin/posts',{posts : posts});
    }).catch(err=>{

    });
});

router.get('/my-posts', (req, res) => {
    Post.find({user:req.user.id}).populate('category').then(posts=>{
        res.render('admin/posts/my-posts',{posts : posts});
    }).catch(err=>{

    });
});

router.get('/edit/:id', (req, res) => {
    let promises = [
        Post.findOne({_id:req.params.id}).exec(),
        Category.find({}).exec(),
    ];

    Promise.all(promises).then(([post,categories])=>{
        res.render('admin/posts/edit',{post : post,categories:categories});
    }).catch(err=>{

    });

});

router.put('/edit/:id', (req, res) => {
    const allowComments = !!req.body.allowComments;

    Post.findOne({_id:req.params.id}).then(post=>{
        post.title=req.body.title;
        post.body=req.body.body;
        post.status=req.body.status;
        post.allowComments=allowComments;
        post.category=req.body.category;
        post.user=req.user.id;
        let fileName = '';
        if (!isEmpty(req.files)){
            let file = req.files.file;
            fileName =  Date.now()+'-'+file.name;
            file.mv('./public/uploads/' + fileName , err => {
                if (err) throw  err
            });

            post.file = fileName;
        }

        post.save().then(p=>{
            req.flash('success_message', `Post ${p.title} Updated successfully `);
            res.redirect('/admin/posts');
        }).catch(err=>{
        });
    }).catch(err=>{
    });
});

router.delete('/:id', (req, res) => {
    let id = req.params.id;

    const promise = [
        Post.findOne({_id:id}).exec(),
        Comment.deleteMany({post:id}).exec()
    ];

    Promise.all(promise).then(([post,result])=>{
        post.remove().then(result=>{
            req.flash('success_message', `Post Deleted successfully `);
            res.redirect('/admin/posts')
        }).catch(err=>{
        });

        fileExists(uploadDir + post.file).then(exists => {
            if (exists){
                fs.unlink(uploadDir + post.file, (err)=>{
                });
            }
        });
    }).catch(err=>{

    });

    Post.findOne({_id:id}).then(post=>{


    }).catch(err=>{

    });
});

router.get('/create', (req, res) => {
    Category.find({}).then(categories=>{
        res.render('admin/posts/create', {categories : categories});
    }).catch(err=>{
        res.render('home/index');
    });
});

router.post('/create', (req, res) => {

    let fileName = '';
    if (!isEmpty(req.files)){
        let file = req.files.file;
        fileName =  Date.now()+'-'+file.name;
        file.mv('./public/uploads/' + fileName , err => {
            if (err) throw  err
        });
    }

    let allowComments = !!req.body.allowComments;

    const newPost = new Post({
       title:req.body.title,
       body:req.body.body,
       file : fileName,
       status:req.body.status,
       allowComments:allowComments,
       category : req.body.category,
       user:req.user.id
    });

    newPost.save().then(post=>{
        req.flash('success_message', `Post Create successfully ${post.title} `);
        res.redirect('/admin/posts')
    }).catch(err=>{

        res.render('admin/posts/create',{errors : err.errors})
    });

});



module.exports = router;
