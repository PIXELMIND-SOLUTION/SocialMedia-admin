import React from 'react';

const Analytics = ({ darkMode, collapsed }) => {
  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Analytics
      </h1>
      {/* Add analytics content */}
    </div>
  );
};

export default Analytics;