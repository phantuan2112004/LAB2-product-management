
var mongoose = require("mongoose");
var SchemaTypes = mongoose.SchemaTypes; 

var ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'], 
        minlength: [3, 'Product name must be at least 3 characters'],
        maxlength: [30, 'Product name cannot exceed 30 characters'] 
    },

    image: {
        type: String,
        default: 'placeholder.jpg'
    },
    description: {
        type: String
    },

    category: {
        type: SchemaTypes.ObjectId,
        ref: 'categories', 
        required: [true, 'Category is required']
    },
  
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Product price cannot be negative'], 
        max: [100000000, 'Product price seems too high']
    }
});

var ProductModel = mongoose.model("products", ProductSchema);
module.exports = ProductModel;