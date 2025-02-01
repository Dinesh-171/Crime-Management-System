import React from 'react';

export default function Footer() {
  return (
    <div>
      <footer className=" bg-black text-white font-sans py-5 text-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap px-5">
          <div className="footer-logo">
            <h3 className="text-2xl font-semibold text-gray-300">Crime Management System</h3>
          </div>
          <div className="footer-links flex gap-5 items-center">
            <a href="#" className="text-gray-300 hover:text-blue-400">Home</a>
            <a href="#" className="text-gray-300 hover:text-blue-400">About</a>
            <a href="#" className="text-gray-300 hover:text-blue-400">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-blue-400">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-blue-400">Contact</a>
          </div>
          <div className="footer-contact">
            <p className="text-gray-300">
              For inquiries, reach us at <a href="mailto:support@cms.com" className="text-blue-400 hover:underline">support@cms.com</a>
            </p>
          </div>
        </div>
        <div className="footer-bottom text-center mt-5">
          <p className="text-xs">&copy; 2025 Crime Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}