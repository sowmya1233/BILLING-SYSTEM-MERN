const express = require("express");
const Inventory = require("../models/inventoryModel");
const router = express.Router();

// Add a new inventory item
router.post("/", async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json({ message: "Item added successfully." });
  } catch (error) {
    res.status(400).json({ error: "Error adding item: " + error.message });
  }
});

// Get all inventory items
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items: " + error.message });
  }
});

// Validate product code
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const product = await Inventory.findOne({ code });

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error validating product code:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update an inventory item
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ error: "Item not found." });
    res.status(200).json({ message: "Item updated successfully." });
  } catch (error) {
    res.status(400).json({ error: "Error updating item: " + error.message });
  }
});

// Delete an inventory item
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found." });
    res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting item: " + error.message });
  }
});

module.exports = router;
