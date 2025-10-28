// routes/product.js (Phiên bản Hoàn Chỉnh - Đã thêm Middleware Bảo vệ)

console.log("ĐANG CHẠY FILE ROUTES/PRODUCT.JS MỚI NHẤT!!!!"); // (Dòng debug)
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const checkLoginSession = require('../middlewares/auth'); // <-- Import middleware

var ProductModel = require("../models/ProductModel");
var CategoryModel = require("../models/CategoryModel");

// === 1. READ (GET) ===
router.get('/', checkLoginSession, async (req, res) => {
    try {
        let filter = {};
        if (req.query.category && req.query.category !== 'all') {
            filter.category = req.query.category;
        }
        var productList = await ProductModel.find(filter).populate('category');
        var categoryList = await CategoryModel.find({});
        res.render('product/index', {
            productList: productList,
            categoryList: categoryList,
            selectedCategory: req.query.category,
            title: 'Product Management'
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.render('error', { error: error });
    }
});

// === 2. CREATE (GET/POST) ===
router.get('/add', checkLoginSession, async (req, res) => {
    try {
        var categoryList = await CategoryModel.find({});
        res.render('product/add', {
            categoryList: categoryList,
            title: 'Add New Product'
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.redirect('/product');
    }
});

router.post('/add', checkLoginSession, (req, res) => {
    const upload = req.app.get('upload');
    upload.single('image')(req, res, async function (err) {
        if (err) {
            console.error("Multer error:", err);
            var categoryList = await CategoryModel.find({});
            return res.render('product/add', {
                categoryList: categoryList,
                error: 'File upload failed. Please try again.'
            });
        }
        try {
            var productData = req.body;
            if (req.file) { productData.image = req.file.filename; }
            else { productData.image = 'placeholder.jpg'; }
            await ProductModel.create(productData);
            res.redirect('/product');
        } catch (error) {
            if (error.name === 'ValidationError') {
                let inputErrors = {};
                for (let field in error.errors) {
                    inputErrors[field] = error.errors[field].message;
                }
                var categoryList = await CategoryModel.find({});
                res.render('product/add', {
                    categoryList: categoryList,
                    inputErrors: inputErrors,
                    product: productData,
                    title: 'Add New Product'
                });
            } else {
                console.error("Error adding product:", error);
                var categoryList = await CategoryModel.find({});
                res.render('product/add', {
                    categoryList: categoryList,
                    error: 'An unexpected error occurred.'
                });
            }
        }
    });
});

// === 3. UPDATE (GET/POST) ===
router.get('/edit/:id', checkLoginSession, async (req, res) => {
    try {
        var id = req.params.id;
        var product = await ProductModel.findById(id);
        var categoryList = await CategoryModel.find({});
        if (!product) { return res.redirect('/product'); }
        res.render('product/edit', {
            product: product,
            categoryList: categoryList,
            title: 'Edit Product'
        });
    } catch (error) {
        console.error("Error fetching product for edit:", error);
        res.redirect('/product');
    }
});

router.post('/edit/:id', checkLoginSession, (req, res) => {
    const upload = req.app.get('upload');
    var id = req.params.id;
    upload.single('image')(req, res, async function (err) {
        if (err) {
            console.error("Multer error:", err);
            return res.redirect('/product/edit/' + id);
        }
        try {
            var productData = req.body;
            if (req.file) {
                productData.image = req.file.filename;
                const oldProduct = await ProductModel.findById(id);
                if (oldProduct.image && oldProduct.image !== 'placeholder.jpg') {
                    const oldImagePath = path.join(__dirname, '../public/images', oldProduct.image);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error("Could not delete old image:", err);
                    });
                }
            }
            await ProductModel.findByIdAndUpdate(id, productData);
            res.redirect('/product');
        } catch (error) {
            console.error("Error updating product:", error);
            res.redirect('/product');
        }
    });
});

// === 4. DELETE (GET) ===
router.get('/delete/:id', checkLoginSession, async (req, res) => {
    try {
        var id = req.params.id;
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if (deletedProduct && deletedProduct.image && deletedProduct.image !== 'placeholder.jpg') {
            const imagePath = path.join(__dirname, '../public/images', deletedProduct.image);
            fs.unlink(imagePath, (err) => {
                if (err) { console.error("Error deleting image file:", err); }
            });
        }
        res.redirect('/product');
    } catch (error) {
        console.error("Error deleting product:", error);
        res.redirect('/product');
    }
});

// === 5. ROUTE SEARCH ===
router.post('/search', checkLoginSession, async (req, res) => {
  try {
    var keyword = req.body.keyword;
    var productList = await ProductModel.find({ name: new RegExp(keyword, "i") }).populate('category');
    var categoryList = await CategoryModel.find({});
    res.render('product/index', {
        productList: productList,
        categoryList: categoryList,
        title: 'Search Results'
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.redirect('/product');
  }
});

// === 6. ROUTES SORT ===
router.get('/sort/asc', checkLoginSession, async (req, res) => {
  try {
    var productList = await ProductModel.find({}).sort({ name: 1 }).populate('category');
    var categoryList = await CategoryModel.find({});
    res.render('product/index', {
        productList: productList,
        categoryList: categoryList,
        title: 'Products A-Z'
    });
  } catch (error) {
    console.error("Error sorting products asc:", error);
    res.redirect('/product');
  }
});

router.get('/sort/desc', checkLoginSession, async (req, res) => {
  try {
    var productList = await ProductModel.find({}).sort({ name: -1 }).populate('category');
    var categoryList = await CategoryModel.find({});
    res.render('product/index', {
        productList: productList,
        categoryList: categoryList,
        title: 'Products Z-A'
    });
  } catch (error) {
    console.error("Error sorting products desc:", error);
    res.redirect('/product');
  }
});

module.exports = router;