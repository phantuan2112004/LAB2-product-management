var mongoose = require("mongoose");
var CategorySchema = mongoose.Schema({
  name: String,
  description: String,
});

var CategoryModel = mongoose.model("categories", CategorySchema);
module.exports = CategoryModel;
