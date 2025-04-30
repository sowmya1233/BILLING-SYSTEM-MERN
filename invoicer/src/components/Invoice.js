import React, { useState, useRef } from "react";
import axios from "axios";
import { AiOutlineLogout } from "react-icons/ai"; // Import logout icon
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import QrReader from "react-qr-barcode-scanner"; // Import the barcode scanner
import ClientDetails from "../components/ClientDetails";
import Dates from "../components/Dates";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Notes from "../components/Notes";
import Table from "../components/Table";
import TableForm from "../components/TableForm";

import { AiOutlineScan } from "react-icons/ai"; 

export default function Invoice() {
  const [showInvoice, setShowInvoice] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [InvoiceNumber, setInvoiceNumber] = useState("");
  const [InvoiceDate, setInvoiceDate] = useState("");
  const [gstin, setGstin] = useState("");
  const [notes, setNotes] = useState("");
  const [code, setCode] = useState("");
  const [productname, setProductname] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [gst, setGst] = useState("");
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false); // State to control scanner visibility
  const printRef = useRef();

  const navigate = useNavigate(); // Use useNavigate hook to handle navigation

  const handleUPIPayment = () => {
    navigate("/payment", {
      state: { invoiceNumber: InvoiceNumber } // Passing invoiceNumber to PaymentPage
    });
  };


  const handleLogout = () => {
    navigate("/login");
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open("", "", "width=800,height=600");
    windowPrint.document.write("<html><head><title>Invoice</title></head><body>");
    windowPrint.document.write(printContent.innerHTML);
    windowPrint.document.write("</body></html>");
    windowPrint.document.close();
    windowPrint.print();
  };

  const handleSave = async () => {
    const invoiceData = {
      clientName,
      clientAddress,
      invoiceNumber: InvoiceNumber,
      invoiceDate: InvoiceDate,
      gstin,
      notes,
      products: list.map(({ code, productname, quantity, price, gst, amount }) => ({
        code,
        productName: productname,
        quantity,
        price,
        gst,
        amount,
      })),
      total,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/invoices", invoiceData);
      console.log("Invoice saved successfully", response.data);
      alert("Invoice saved to the database successfully!");
    } catch (error) {
      console.error("Error saving invoice", error);
      setErrorMessage(error.response?.data || "Failed to save invoice. Please try again.");
    }
  };

  const closeErrorModal = () => setErrorMessage("");

  const handleScan = (data) => {
    if (data) {
      setCode(data.text); // Update the code field with scanned value
      setIsScannerOpen(false); // Close the scanner after scanning
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  return (
    <>
      {errorMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold text-red-500">Error</h3>
            <p className="mt-2 text-sm text-gray-700">{errorMessage}</p>
            <button
              onClick={closeErrorModal}
              className="mt-4 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isScannerOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-2">Scan Barcode</h2>
            <QrReader
              onUpdate={(err, result) => {
                if (result) {
                  setCode(result.text); // Update the code field with scanned value
                  setIsScannerOpen(false); // Close the scanner after scanning
                }
                if (err) {
                  console.error(err);
                }
              }}
              style={{ width: "100%" }}
            />
            <button
              onClick={() => setIsScannerOpen(false)}
              className="mt-4 bg-red-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-red-500 hover:bg-transparent hover:text-red-500 transition-all duration-300"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}

      <main className="m-5 p-5 max-w-4xl mx-auto bg-white rounded shadow relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-all duration-300"
        >
          <AiOutlineLogout />
        </button>

        {showInvoice ? (
          <div ref={printRef} className="w-full text-left">
            <Header />
            <ClientDetails clientName={clientName} clientAddress={clientAddress} gstin={gstin} />
            <Dates InvoiceNumber={InvoiceNumber} InvoiceDate={InvoiceDate} />
            <Table
              code={code}
              productname={productname}
              quantity={quantity}
              price={price}
              gst={gst}
              amount={amount}
              list={list}
              setList={setList}
              total={total}
              setTotal={setTotal}
            />
            <Notes notes={notes} />
            <Footer />
            <div className="flex gap-4 no-print print:hidden py-8">
              <button
                onClick={() => setShowInvoice(false)}
                className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
              >
                Edit Information
              </button>
              <button
                onClick={handlePrint}
                className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
              >
                Print
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
              >
                Save
              </button>
              <button
                onClick={handleUPIPayment}
                className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
              >
                UPI
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center">
              <Header />
              <article className="md:grid grid-cols-2 gap-10 md:mt-20">
                <div className="flex flex-col">
                  <label htmlFor="clientName">Enter your Client's name:</label>
                  <input
                    type="text"
                    name="clientName"
                    id="clientName"
                    placeholder="Enter Your Client's name"
                    autoComplete="off"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="clientAddress">Enter your Client's Address:</label>
                  <input
                    type="text"
                    name="clientAddress"
                    id="clientAddress"
                    placeholder="Enter Your Client's Address"
                    autoComplete="off"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>
              </article>
              <article className="md:grid grid-cols-3 gap-10">
                <div className="flex flex-col">
                  <label htmlFor="InvoiceNumber">Invoice Number:</label>
                  <input
                    type="text"
                    name="InvoiceNumber"
                    id="InvoiceNumber"
                    placeholder="Invoice Number"
                    autoComplete="off"
                    value={InvoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="InvoiceDate">Invoice Date:</label>
                  <input
                    type="date"
                    name="InvoiceDate"
                    id="InvoiceDate"
                    placeholder="Invoice Date"
                    autoComplete="off"
                    value={InvoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="gstin">Client's GSTIN:</label>
                  <input
                    type="text"
                    name="gstin"
                    id="gstin"
                    placeholder="GSTIN"
                    autoComplete="off"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                  />
                </div>
              </article>
              
              <article> 
                <TableForm
                  code={code}
                  setCode={setCode}
                  productname={productname}
                  setProductname={setProductname}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  price={price}
                  setPrice={setPrice}
                  gst={gst}
                  setGst={setGst}
                  amount={amount}
                  setAmount={setAmount}
                  list={list}
                  setList={setList}
                  total={total}
                  setTotal={setTotal}
                  setErrorMessage={setErrorMessage}
                  setIsScannerOpen={setIsScannerOpen}
                />
              </article>
              <label htmlFor="notes">Additional Notes:</label>
              <textarea
                name="notes"
                id="notes"
                cols="30"
                rows="10"
                placeholder="Additional notes to the client"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
              <button
                onClick={() => setShowInvoice(true)}
                className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
              >
                Preview Invoice
              </button>

            
            </div>
            
          </>
        )}
      </main>
      
    </>
  );
}
