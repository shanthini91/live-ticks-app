// src/pages/AccountPage.tsx
import React, { useState } from "react";

const AccountPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert("Settings saved! (Wire it up to backend later)");
  };

  return (
    <div className="p-6 space-y-8">
      {/* Profile Section */}
      <div className="bg-gray-800 rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Profile Details</h2>
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100"
            alt="Avatar"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <p className="font-semibold text-lg">John Doe</p>
            <p className="text-gray-300">johndoe@example.com</p>
            <p className="text-gray-300 text-sm">Member since: Jan 2024</p>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-gray-800 rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Settings</h2>

        <div className="space-y-4">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Enable Notifications</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 px-4 py-2 bg-yellow-600 text-black rounded hover:bg-yellow-700 font-semibold"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
