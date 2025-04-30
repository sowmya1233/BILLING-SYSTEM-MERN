const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  code: { type: String, required: true },
  productname: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  gst: { type: Number, required: true },
});

module.exports = mongoose.model("Inventory", inventorySchema);
