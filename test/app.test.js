const expect = require('expect');
const request = require('supertest');

const {app} = require('./../app');
const {Posts} = require('./../models/Post');
const {Comment} = require('./../models/Comment');
const {Category} = require('./../models/Category');
const {User} = require('./../models/User');

describe('POST /admin/comments/approve-comment',()=>{
    it('it should approve comment',done=>{
       request(app)
           .post('/admin/comments/approve-comment')
           .send({id:'5abca1713a9db2157bf4a932',approveComment:true})
           .expect(200)
           .expect(res=>{
               expect(res.body.approveComment).toBe(true);
           })
           .end((err)=>{
                if (err){
                    return done(err)
                }
                done();
           })
    });
});

describe('GET /admin/posts',()=>{
    it('it should get all posts',done=>{
        request(app)
            .get('/admin/posts/test')
            .expect(200)
            .expect(res=>{
                let test =  res.body.posts.length > 0;
                expect(test).toBe(true);
            })
            .end((err,res)=>{
                if (err){
                    return done(err)
                }
                done();
            })
    });
});