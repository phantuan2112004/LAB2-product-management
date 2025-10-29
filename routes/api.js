const express = require('express');
const router = express.Router();
var ProductModel = require("../models/ProductModel");

router.get('/product', async (req, res) => {
    try {
        var products = await ProductModel.find({}).populate('category');
        res.status(200).json(products); 
    } catch (err) {
        res.status(400).send('Load product list failed! ' + err); 
    }
});

router.post('/product/add', async (req, res) => {
    try {
        var productData = req.body;
        await ProductModel.create(productData); 
        res.status(201).send('Create product succeed !'); 
    } catch (err) {
        res.status(400).send('Create product failed! ' + err); 
    }
});

router.put('/product/edit/:id', async (req, res) => {
    try {
        var id = req.params.id;
        var productData = req.body;
        await ProductModel.findByIdAndUpdate(id, productData); 
        res.status(200).send('Edit product succeed !'); 
    } catch (err) {
        res.status(400).send('Edit product failed! ' + err); 
    }
});

router.delete('/product/delete/:id', async (req, res) => {
    try {
        var id = req.params.id;
        await ProductModel.findByIdAndDelete(id); 
        res.status(200).send('Delete product succeed!'); 
    } catch (err) {
        res.status(400).send('Delete product failed! ' + err); 
    }
});

module.exports = router; 