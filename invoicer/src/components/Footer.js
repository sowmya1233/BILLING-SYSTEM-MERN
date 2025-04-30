import React from 'react';

export default function Footer({ email, phone, role }) {
  return (
    <>
      <footer className="footer border-t-2 border-gray-300 pt-5 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} M.S. Agencies. All rights reserved.
        </p>
        <p className="text-sm">
          <span className="font-bold">Email: </span>{email || 'ttpmsagencies1@gmail.com'} | 
          <span className="font-bold"> Phone: </span>{phone || '9842122352'}
        </p>
        
      </footer>
    </>
  );
}
