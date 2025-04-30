const express = require("express");
const Invoice = require("../models/invoiceModel");
const Inventory = require("../models/inventoryModel");
const router = express.Router();

// Create a new invoice
router.post("/", async (req, res) => {
  try {
    const { products } = req.body; // Products array in the request body

    // Check if products array is provided
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).send("No products provided in the invoice.");
    }

    // Loop through all products in the invoice
    for (let product of products) {
      // Ensure product data is valid
      if (!product.code || !product.quantity || !product.productName) {
        return res.status(400).send("Missing required product details.");
      }

      // Check if the product exists in inventory
      const inventoryItem = await Inventory.findOne({ code: product.code });
      if (!inventoryItem) {
        return res.status(400).send(`Product with code ${product.code} not found in inventory.`);
        
      }

      // Check if the requested quantity is available
      if (product.quantity > inventoryItem.quantity) {
        return res.status(400).send(`Insufficient stock for product ${product.productName}. Available: ${inventoryItem.quantity}.`);
      }

      // Calculate the amount for this product in the invoice
      product.amount = (product.quantity * inventoryItem.price) * (1 + (inventoryItem.gst / 100));
    }

    // Calculate the total amount for the invoice
    const totalAmount = products.reduce((total, product) => total + product.amount, 0);

    // Create and save the new invoice
    const newInvoice = new Invoice({
      ...req.body,
      total: totalAmount,
    });
    await newInvoice.save();

    // Update inventory: reduce the quantity for each product billed
    for (let product of products) {
      await Inventory.findOneAndUpdate(
        { code: product.code },
        { $inc: { quantity: -product.quantity } }
      );
    }

    // Send the created invoice response
    res.status(201).send(newInvoice);
  } catch (error) {
    console.error("Error creating invoice:", error.message);
    res.status(500).send("An error occurred while creating the invoice. Please try again later.");
  }
});

module.exports = router;
