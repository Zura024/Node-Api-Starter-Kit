const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const faker = require('faker');

router.all('/*',(req,res,next)=>{
   req.app.locals.layout = 'admin';
   next();
});

router.get('/', (req, res) => {
    Category.find({}).then(categories=>{
        res.render('admin/categories/index',{categories : categories});
    }).catch(err=>{

    });
});
router.post('/create', (req, res) => {
    const newCategory = new Category({
        name:req.body.name,
    });

    newCategory.save().then(category=>{
        req.flash('success_message', `Category Create successfully ${category.name} `);
        res.redirect('/admin/categories')
    }).catch(err=>{
        res.render('admin/categories/index',{errors : err.errors})
    });
});

router.get('/edit/:id', (req, res) => {
    let id = req.params.id;

    Category.findOne({_id:id}).then(category=>{
        res.render('admin/categories/edit',{category : category});
    }).catch(err=>{

    });
});

router.put('/edit/:id', (req, res) => {
    let id = req.params.id;
    Category.findOne({_id:id}).then(category=>{
        category.name=req.body.name;
        category.save().then(c=>{
            req.flash('success_message', `Category ${c.name} Updated successfully `);
            res.redirect('/admin/categories');
        }).catch(err=>{
        });
    }).catch(err=>{
    });
});
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    Category.remove({_id:id}).then(category=>{
        console.log(category);
        req.flash('success_message', `Category Deleted successfully `);
        res.redirect('/admin/categories')
    }).catch(err=>{

    });
});


module.exports = router;
