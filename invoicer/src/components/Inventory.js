import React, { useState, useEffect } from "react";
import InventoryTable from "./InventoryTable";
import axios from "axios";
import JsBarcode from "jsbarcode";

export default function Inventory() {
  const [code, setCode] = useState("");
  const [productname, setProductname] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [gst, setGst] = useState("");
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [barcode, setBarcode] = useState("");

  // Fetch inventory items
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/inventory")
      .then((response) => setList(response.data))
      .catch((error) => console.error("Error fetching inventory:", error));
  }, []);

  const generateBarcode = (id) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, id, { format: "CODE128" });
    setBarcode(canvas.toDataURL("image/png"));
  };

  const handleGenerateBarcode = () => {
    if (selectedItem) {
      generateBarcode(selectedItem);
    } else {
      alert("Please select an item number.");
    }
  };

  return (
    <main className="m-5 p-5 max-w-4xl mx-auto bg-white rounded shadow">
      {/* <div className="mb-4">
        <label htmlFor="itemNumber" className="font-medium mb-1">Select Item Number:</label>
        <select
          id="itemNumber"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Choose Item Number</option>
          {list.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id}
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
      {barcode && (
        <div className="mt-4">
          <img src={barcode} alt="Generated Barcode" />
          <button
            onClick={() => window.print()}
            className="mt-4 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
          >
            Print Barcode
          </button>
        </div>
      )} */}
      <InventoryTable
        code={code}
        setCode={setCode}
        productname={productname}
        setProductname={setProductname}
        price={price}
        setPrice={setPrice}
        gst={gst}
        setGst={setGst}
        quantity={quantity}
        setQuantity={setQuantity}
        list={list}
        setList={setList}
      />
    </main>
  );
}
