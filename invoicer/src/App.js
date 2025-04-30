import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Invoice from './components/Invoice';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import CashierLogin from './components/CashierLogin';
import PaymentPage from "./components/PaymentPage";

export default function App() {
  return (
    <Router>
      <div>
        
        <Routes>
          
        <Route path="/" element={<Signup />} /> {/* Add a route for Invoice */}
        <Route path="/login" element={<Login />} /> {/* Add a route for Invoice */}
        <Route path="/cashierlogin" element={<CashierLogin />} /> {/* Add a route for Invoice */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add a route for Invoice */}
        <Route path="/inventory" element={<Inventory />} /> {/* Add a route for Invoice */}
          <Route path="/invoice" element={<Invoice />} /> {/* Add a route for Invoice */}
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </div>
    </Router>
  );
} 

