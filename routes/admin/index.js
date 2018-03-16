const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const Category = require('../../models/Category');
const faker = require('faker');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*',(req,res,next)=>{
   req.app.locals.layout = 'admin';
   next();
});

router.get('/', (req, res) => {

    const promises = [
        Post.count().exec(),
        Comment.count().exec(),
        Category.count().exec()
    ];

    Promise.all(promises).then(([postCount,commentCount,categoryCount])=>{
        res.render('admin/index', {postCount:postCount,commentCount:commentCount,categoryCount:categoryCount});
    });

});

router.post('/generate-fake-posts', (req, res) => {

    for (let i = 0; i < req.body.amount; i++){

        const newPost = new Post({
            title:faker.name.title(),
            body:faker.lorem.sentence(),
            status:'public',
            file:'Screenshot from 2018-03-13 19-44-19.png',
            allowComments:true
        });

        newPost.save().then(post=>{
            console.log(post);
        }).catch(err=>{
            console.log(err);
        });
    }
    res.send('coool');
});

router.get('/dashboard', (req, res) => {
    res.render('admin/index');
});

//comments
router.get('/comments', (req, res)=>{
    Comment.find().populate('user')
        .then(comments=>{
            res.render('admin/comments', {comments: comments});
        });
});



router.post('/comments', (req, res)=>{
    Post.findOne({_id: req.body.id}).then(post=>{
        const newComment = new Comment({
            user: req.user.id,
            body: req.body.body,
            post: req.body.id,
            approveComment: true
        });
        post.comments.push(newComment);
        post.save().then(savedPost=>{
            newComment.save().then(savedComment=>{
                req.flash('success_message', 'Your Comment successfully')
                res.redirect(`/post/${post.slug}`);
            })
        });
    });
});



router.delete('/comments/:id', (req, res)=>{


    Comment.remove({_id: req.params.id}).then(deleteItem=>{

        Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data)=>{

            if(err) console.log(err);

            res.redirect('/admin/comments');

        });

    });

});



router.post('/comments/approve-comment', (req, res)=>{
    Comment.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}}, (err, result)=>{
        if(err) return err;
        res.send(result)
    });
});





module.exports = router;
