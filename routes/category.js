const express = require('express');
const router = express.Router();

var CategoryModel = require("../models/CategoryModel");
var ProductModel = require("../models/ProductModel");

// === READ (GET) ===
router.get('/', async (req, res) => {
    try {
        var categoryList = await CategoryModel.find({});
        res.render('category/index', {
            categoryList: categoryList,
            title: 'Category Management'
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.render('error', { error });
    }
});

// === CREATE (GET/POST) ===
router.get('/add', (req, res) => {
    res.render('category/add', { title: 'Add New Category' });
});

router.post('/add', async (req, res) => {
    try {
        var category = req.body;
        await CategoryModel.create(category);
        res.redirect('/category');
    } catch (error) {
        console.error("Error adding category:", error);
        res.render('category/add', {
            error: 'Failed to add category. Please check your input.',
            title: 'Add New Category',
            category: req.body 
        });
    }
});

// === UPDATE (GET/POST) ===
router.get('/edit/:id', async (req, res) => {
    try {
        var id = req.params.id;
        var category = await CategoryModel.findById(id);
        if (!category) {
            return res.redirect('/category');
        }
        res.render('category/edit', { category: category, title: 'Edit Category' });
    } catch (error) {
        console.error("Error fetching category for edit:", error);
        res.redirect('/category');
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        var id = req.params.id;
        var data = req.body;
        await CategoryModel.findByIdAndUpdate(id, data, { runValidators: true });
        res.redirect('/category');
    } catch (error) {
        console.error("Error updating category:", error);
        var category = await CategoryModel.findById(id);
        res.render('category/edit', {
            error: 'Failed to update category.',
            title: 'Edit Category',
            category: category 
        });
    }
});

// === DELETE (GET) ===
router.get('/delete/:id', async (req, res) => {
    try {
        var id = req.params.id;
        await CategoryModel.findByIdAndDelete(id);
        res.redirect('/category');
    } catch (error) {
        console.error("Error deleting category:", error);
        res.redirect('/category');
    }
});

// === ROUTE LỌC SẢN PHẨM THEO DANH MỤC ===
router.get('/detail/:id', async (req, res) => {
  try {
    var categoryId = req.params.id;
    var productList = await ProductModel.find({ category: categoryId }).populate('category');
    var categoryList = await CategoryModel.find({});

    res.render('product/index', {
        productList: productList,
        categoryList: categoryList,   
        selectedCategory: categoryId,  
        title: 'Filtered Products'
    });

  } catch (error) {
    console.error("Error filtering products:", error);
    res.redirect('/category'); 
  }
});

module.exports = router;