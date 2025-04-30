const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientAddress: { type: String, required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, required: true },
  gstin: { type: String },
  notes: { type: String },
  products: [
    {
      code: { type: String },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      gst: { type: Number },
      amount: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
