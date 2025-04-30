import React from "react";
import { useLocation } from "react-router-dom";
import qrCode from './qr.jpg'; 

const PaymentPage = () => {
  // You can pass any necessary details like invoice info via location.state if needed
  const location = useLocation();
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
        <h2 className="text-lg font-bold mb-4">Make Payment</h2>
        <p className="mb-6">Scan the QR code to pay </p>
        
        {/* QR Code (You can use any QR Code generator library here) */}
        <img
          src={qrCode}  // Replace with your actual UPI QR Code
          alt="UPI QR Code"
          className="w-full h-auto mb-6"
        />

        <p className="text-sm text-gray-500">
          Please scan this QR code to complete your payment.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
