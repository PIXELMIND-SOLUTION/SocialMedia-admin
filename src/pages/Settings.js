import React from 'react';

const Settings = ({ darkMode, collapsed }) => {
  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Settings
      </h1>
      {/* Add settings content */}
    </div>
  );
};

export default Settings;