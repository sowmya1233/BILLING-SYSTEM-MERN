import { useState, useEffect } from "react";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineScan } from "react-icons/ai";
import axios from "axios";

export default function TableForm({
  code,
  setCode,
  productname,
  setProductname,
  quantity,
  setQuantity,
  price,
  setPrice,
  gst,
  setGst,
  amount,
  setAmount,
  list,
  setList,
  total,
  setTotal,
  setErrorMessage,
  setIsScannerOpen,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Automatically fetch product details when `code` changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!code) {
        setProductname("");
        setPrice("");
        setGst("");
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:8080/api/inventory/${code}`);
        const inventoryItem = response.data;
  
        if (inventoryItem) {
          setProductname(inventoryItem.productname);
          setPrice(inventoryItem.price);
          setGst(inventoryItem.gst);
        } else {
          setTimeout(() => {
            alert(`Product with code ${code} is not found in the inventory.`);
          }, 3000); // Delay the alert by 3 seconds
          setProductname("");
          setPrice("");
          setGst("");
        }
      } catch (error) {
        setTimeout(() => {
          if (error.response && error.response.status === 404) {
            alert(`Product with code ${code} is not found in the inventory.`);
          } else {
            alert("An error occurred while fetching the product details. Please try again later.");
          }
        }, 3000); // Delay the alert by 3 seconds
        setProductname("");
        setPrice("");
        setGst("");
      }
    };
  
    const delayDebounceFn = setTimeout(() => {
      fetchProductDetails();
    }, 500); // Wait for 500ms after user stops typing
  
    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on code change
  }, [code, setProductname, setPrice, setGst]);
  
  // Submit form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productname || !quantity || !price || !gst || !code) {
      alert("Please fill in all inputs");
      return;
    }

    try {
      setIsLoading(true);

      // Validate the product against inventory
      const response = await axios.get(`http://localhost:8080/api/inventory/${code}`);
      const inventoryItem = response.data;

      if (!inventoryItem) {
        alert(`Product with code ${code} is not found in the inventory.`);
        setIsLoading(false);
        return;
      }

      if (quantity > inventoryItem.quantity) {
        alert(`Insufficient stock for product ${productname}. Available: ${inventoryItem.quantity}`);
        setIsLoading(false);
        return;
      }

      // Calculate the amount
      const calculatedAmount = (price * quantity * (1 + gst / 100)).toFixed(2);

      const newItems = {
        id: editingId || uuidv4(),
        code,
        productname,
        quantity,
        price,
        gst,
        amount: calculatedAmount,
      };

      // Clear input fields
      setCode("");
      setProductname("");
      setQuantity("");
      setPrice("");
      setGst("");
      setAmount("");

      if (isEditing) {
        // Update existing item
        setList(list.map((item) => (item.id === editingId ? newItems : item)));
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Add new item
        setList([...list, newItems]);
      }
    } catch (error) {
      // Check if the error is due to an API issue
      if (error.response && error.response.status === 404) {
        alert(`Product with code ${code} is not found in the inventory.`);
      } else {
        alert("An error occurred while validating the product. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate items amount function
  useEffect(() => {
    const calculateAmount = () => {
      setAmount(Math.ceil(quantity * price * (1 + gst / 100)));
    };
    calculateAmount();
  }, [quantity, price, gst, setAmount]);

  // Calculate total
  useEffect(() => {
    let rows = document.querySelectorAll(".amount");
    let sum = 0;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].className === "amount") {
        sum += isNaN(rows[i].innerHTML) ? 0 : parseFloat(rows[i].innerHTML);
      }
    }
    setTotal(sum);
  });

  // Edit button
  const editRow = (id) => {
    const editingRow = list.find((row) => row.id === id);
    setIsEditing(true);
    setEditingId(id);
    setCode(editingRow.code);
    setProductname(editingRow.productname);
    setQuantity(editingRow.quantity);
    setPrice(editingRow.price);
    setGst(editingRow.gst);
  };

  

  // Delete button
  const deleteRow = (id) => setList(list.filter((row) => row.id !== id));

  return (
    <>
    
      <form onSubmit={handleSubmit}>
      <div className="md:grid grid-cols-3 gap-20">
    <div className="flex flex-col md:mt-16 ">
      <label htmlFor="code">Item code</label>
      <div className="flex items-center space-x-2 w-full ">
        <input
          type="text"
          name="code"
          id="code"
          placeholder="Item code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded"
        />
         <button
          onClick={() => setIsScannerOpen(true)}
          className="bg-indigo-500 text-white p-3 rounded text-xs flex items-center justify-center mb-7"
        >
          <AiOutlineScan size={16} />
        </button> 
      </div>
    </div>

    <div className="flex flex-col md:mt-16 w-full">
      <label htmlFor="productname">Product Name</label>
      <input
        type="text"
        name="productname"
        id="productname"
        placeholder="Product Name"
        value={productname}
        readOnly
        className="p-2 border border-gray-300 rounded w-full"
      />
    </div>
  </div>

        <div className="md:grid grid-cols-3 gap-10 ">
          <div className="flex flex-col">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="text"
              name="quantity"
              id="quantity"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              name="price"
              id="price"
              placeholder="Price"
              value={price}
              readOnly
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="gst">GST</label>
            <input
              type="text"
              name="gst"
              id="gst"
              placeholder="GST"
              value={gst}
              readOnly
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`mb-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isEditing ? "Update Item" : isLoading ? "Processing..." : "Add Table Item"}
        </button>
      </form>

      <table width="100%" className="mb-10">
        <thead>
          <tr className="bg-gray-100 p-1">
            <td className="font-bold">Code</td>
            <td className="font-bold">Product Name</td>
            <td className="font-bold">Quantity</td>
            <td className="font-bold">Price</td>
            <td className="font-bold">GST%</td>
            <td className="font-bold">Amount</td>
            <td className="font-bold">Action</td>
          </tr>
        </thead>
        {list.map(({ id, code, productname, quantity, price, gst, amount }) => (
          <React.Fragment key={id}>
            <tbody>
              <tr className="border-b border-gray-200">
                <td>{code}</td>
                <td>{productname}</td>
                <td>{quantity}</td>
                <td>{price}</td>
                <td>{gst}</td>
                <td className="amount">{amount}</td>
                <td>
                  <button onClick={() => deleteRow(id)}>
                    <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                  </button>
                </td>
                <td>
                  <button onClick={() => editRow(id)}>
                    <AiOutlineEdit className="text-green-500 font-bold text-xl" />
                  </button>
                </td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
      <div>
        <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
          Rs.{total.toLocaleString()}
        </h2>
      </div>
    </>
  );
}
