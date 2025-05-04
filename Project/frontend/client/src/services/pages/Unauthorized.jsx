import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-300 mb-6">
          Sorry, you don't have permission to access this page.
        </p>
        <div className="space-y-4">
          <p className="text-gray-400">
            Please make sure you are logged in with the correct role to access this feature.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Login Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 