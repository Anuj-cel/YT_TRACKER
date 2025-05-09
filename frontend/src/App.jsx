import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, NavLink,Navigate } from 'react-router-dom';
import Weekly from "./Component/Weekly";
import Hourly from "./Component/Hourly";
import Home from "./Component/Home";
import Monthly from "./Component/Monthly";
import WatchHistory from './Component/WatchHistory';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f1f1f1] to-white text-[#4A4A4A]">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-20 flex flex-wrap justify-between items-center px-6 py-4 bg-white shadow-lg border-b border-gray-200">
          <div className="text-3xl font-extrabold tracking-tight text-blue-500">📺 WatchTracker</div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto mt-2 md:mt-0">
            {['/homepage', '/weekly', '/hourly', '/monthly', '/watchHistory'].map((path, idx) => {
              const labels = ["Home", "Weekly", "Hourly", "Monthly", "WatchHistory"];
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                    }`
                  }
                >
                  {labels[idx]}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path='/' element={<Navigate to="/homepage" replace/>}/>
              <Route path="/homepage" element={<Home />} />
              <Route path="/weekly" element={<Weekly />} />
              <Route path="/hourly" element={<Hourly />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/watchHistory" element={<WatchHistory />} />
            </Routes>
          </AnimatePresence>
        </main>

      </div>
    </Router>
  );
};

export default App;