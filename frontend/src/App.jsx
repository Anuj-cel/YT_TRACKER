import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Weekly from "./Component/Weekly";
import Hourly from "./Component/Hourly";
import Home from "./Component/Home";
import Monthly from "./Component/Monthly";
import Limiter from './Component/Limiter';
import WatchHistory from './Component/WatchHistory';
import LimitModal from './Component/LimitModal';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="max-w-full mx-auto">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-10 flex flex-wrap justify-between items-center p-4 bg-gray-800 text-white shadow-md">
          <div className="text-2xl font-bold">WatchTracker</div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto mt-2 md:mt-0">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `p-2 md:p-4 rounded transition duration-300 ${
                  isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/weekly"
              className={({ isActive }) =>
                `p-2 md:p-4 rounded transition duration-300 ${
                  isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              Weekly
            </NavLink>
            <NavLink
              to="/hourly"
              className={({ isActive }) =>
                `p-2 md:p-4 rounded transition duration-300 ${
                  isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              Hourly
            </NavLink>
            <NavLink
              to="/monthly"
              className={({ isActive }) =>
                `p-2 md:p-4 rounded transition duration-300 ${
                  isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              Monthly
            </NavLink>
            <NavLink
              to="/watchHistory"
              className={({ isActive }) =>
                `p-2 md:p-4 rounded transition duration-300 ${
                  isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              WatchHistory
            </NavLink>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weekly" element={<Weekly />} />
            <Route path="/hourly" element={<Hourly />} />
            <Route path="/monthly" element={<Monthly />} />
            <Route path="/limiter" element={<Limiter />} />
            <Route path="/watchHistory" element={<WatchHistory />} />
          </Routes>
        </div>

        {/* Modals */}
        <LimitModal />
      </div>
    </Router>
  );
};

export default App;
