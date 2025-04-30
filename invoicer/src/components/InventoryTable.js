import React, { useState, useEffect } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

export default function InventoryTable({
  code,
  setCode,
  price,
  setPrice,
  quantity,
  setQuantity,
  productname,
  setProductname,
  gst,
  setGst,
  list,
  setList,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [barcode, setBarcode] = useState("");

  // Fetch inventory data from the backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/inventory");
        setList(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, [setList]);

  // Submit form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!code || !quantity || !price || !productname || !gst) {
      alert("Please fill in all inputs.");
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }
    if (isNaN(gst) || gst < 0) {
      alert("Please enter a valid GST percentage.");
      return;
    }

    const newItem = {
      code,
      productname,
      quantity: Number(quantity),
      price: Number(price),
      gst: Number(gst),
    };

    try {
      if (isEditing) {
        // Update existing item
        await axios.put(`http://localhost:8080/api/inventory/${editingId}`, newItem);
        setList(list.map((item) => (item._id === editingId ? { ...item, ...newItem } : item)));
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Add new item
        const { data } = await axios.post("http://localhost:8080/api/inventory", newItem);
        setList([...list, data]);
      }
    } catch (error) {
      console.error("Error saving inventory item:", error);
    }

    // Reset form
    setCode("");
    setQuantity("");
    setPrice("");
    setProductname("");
    setGst("");
  };

  // Edit button handler
  const editRow = (id) => {
    const editingRow = list.find((row) => row._id === id);
    setIsEditing(true);
    setEditingId(id);
    setCode(editingRow.code);
    setProductname(editingRow.productname);
    setPrice(editingRow.price);
    setQuantity(editingRow.quantity);
    setGst(editingRow.gst);
  };

  // Delete button handler
  const deleteRow = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/inventory/${id}`);
      setList(list.filter((row) => row._id !== id));
    } catch (error) {
      console.error("Error deleting inventory item:", error);
    }
  };

  // Filtered list based on search term
  const filteredList = list.filter(
    (item) => item?.productname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to generate barcode
  const generateBarcode = (code) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, code, { format: "CODE128", width: 2, height: 50 });
    setBarcode(canvas.toDataURL("image/png"));
  };

  // Handle generate barcode button click
  const handleGenerateBarcode = () => {
    if (selectedItem) {
      generateBarcode(selectedItem);
    } else {
      alert("Please select an item number.");
    }
  };

  // Show total products function
  const showTotalProducts = () => {
    alert(`Total number of products: ${list.length}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col md:mt-4 mb-4">
          <label htmlFor="code" className="font-medium mb-1">Item Code</label>
          <input
            type="text"
            name="code"
            id="code"
            placeholder="Item code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="productname" className="font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="productname"
            id="productname"
            placeholder="Product name"
            value={productname}
            onChange={(e) => setProductname(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-4">
          <div className="flex flex-col">
            <label htmlFor="quantity" className="font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="p-2 border rounded-md"
              min="1"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="price" className="font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-2 border rounded-md"
              step="0.001" 
              min="0"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="gst" className="font-medium mb-1">GST %</label>
            <input
              type="number"
              name="gst"
              id="gst"
              placeholder="GST %"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              className="p-2 border rounded-md"
              min="0"
            />
          </div>
        </div>
        <div className="gap-10">
          <button
            type="submit"
            className="mb-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
          >
            {isEditing ? "Update Item" : "Add Table Item"}
          </button>
          <br />
          <button
            onClick={showTotalProducts}
            className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
          >
            Total Products
          </button>
        </div>
      </form>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="itemNumber" className="font-medium mb-1">Select Item Number:</label>
        <select
          id="itemNumber"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Choose Item Number</option>
          {list.map((item) => (
            <option key={item.code} value={item.code}>
              {item.code}
            </option>
          ))}
        </select>
        <button
          onClick={handleGenerateBarcode}
          className="ml-4 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
        >
          Generate Barcode
        </button>
      </div>

      {barcode && <img src={barcode} alt="Generated Barcode" className="mt-4" />}
      
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Product Code</th>
              <th className="px-4 py-2 border">Product Name</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">GST %</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item) => (
              <tr key={item._id}>
                <td className="px-4 py-2 border">{item.code}</td>
                <td className="px-4 py-2 border">{item.productname}</td>
                <td className="px-4 py-2 border">{item.quantity}</td>
                <td className="px-4 py-2 border">{item.price}</td>
                <td className="px-4 py-2 border">{item.gst}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => editRow(item._id)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    <AiOutlineEdit />
                  </button>
                  <button
                    onClick={() => deleteRow(item._id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
