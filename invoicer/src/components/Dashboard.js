import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage'
    console.log("Logout");
    navigate("/login"); // Redirect to login page
  };

  const gotobillingpage = () => navigate("/invoice");
  const gotoinventorypage = () => navigate("/inventory");

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">M.S. AGENCIES</h1>
        <hr className="w-full bg-gray-300 h-0.5 mb-6 border-0" />
        <nav className="flex flex-col gap-4">
          <button
            className="w-full px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            onClick={gotobillingpage}
          >
            BILL
          </button>
          <button
            className="w-full px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            onClick={gotoinventorypage}
          >
            INVENTORY
          </button>
        </nav>
        {/* <button
          className="mt-6 w-full px-4 py-2 text-lg font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
          onClick={logout}
        >
          LOGOUT
        </button> */}
      </div>
    </div>
  );
};

export default Dashboard;
