// import React from 'react';
// import { Suspense } from 'react';
// import { lazy } from 'react';
// import { AnimatePresence } from 'framer-motion';
// import { BrowserRouter as Router, Routes, Route, NavLink,Navigate } from 'react-router-dom';
// import Home from "./Component/Home";
// // import Weekly from "./Component/Weekly";
// // import Hourly from "./Component/Hourly";
// // import Monthly from "./Component/Monthly";
// // import WatchHistory from './Component/WatchHistory';

// const App = () => {
//   const WatchHistory=lazy(()=>import('./Component/WatchHistory'));
//   const Monthly=lazy(()=>import('./Component/Monthly'));
//   const Hourly=lazy(()=>import('./Component/Hourly'));
//   const Weekly=lazy(()=>import('./Component/Weekly'));
//   return (
//     <Router>
//       <div className="min-h-screen bg-gradient-to-br from-white via-[#f1f1f1] to-white text-[#4A4A4A]">
//         {/* Navigation Bar */}
//         <nav className="sticky top-0 z-20 flex flex-wrap justify-between items-center px-6 py-4 bg-white shadow-lg border-b border-gray-200">
//           <div className="text-3xl font-extrabold tracking-tight text-blue-500">📺 WatchTracker</div>
//           <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto mt-2 md:mt-0">
//             {['/homepage', '/weekly', '/hourly', '/monthly', '/watchHistory'].map((path, idx) => {
//               const labels = ["Home", "Weekly", "Hourly", "Monthly", "WatchHistory"];
//               return (
//                 <NavLink
//                   key={path}
//                   to={path}
//                   className={({ isActive }) =>
//                     `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
//                       isActive
//                         ? 'bg-blue-500 text-white shadow-sm'
//                         : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
//                     }`
//                   }
//                 >
//                   {labels[idx]}
//                 </NavLink>
//               );
//             })}
//           </div>
//         </nav>

//         {/* Main Content */}
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <AnimatePresence mode="wait">
//             <Suspense fallback={<div className="text-center text-gray-400 mt-10">Loading...</div>}>
//             <Routes>
//               <Route path='/' element={<Navigate to="/homepage" replace/>}/>
//               <Route path="/homepage" element={<Home />} />
//               <Route path="/weekly" element={<Weekly />} />
//               <Route path="/hourly" element={<Hourly />} />
//               <Route path="/monthly" element={<Monthly />} />
//               <Route path="/watchHistory" element={<WatchHistory />} />
//             </Routes>
//             </Suspense>
//           </AnimatePresence>
//         </main>

//       </div>
//     </Router>
//   );
// };

// export default App;


import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Home, Calendar, Clock, History, BarChart3 } from 'lucide-react';
import Weekly from "./Component/Weekly";
import Hourly from "./Component/Hourly";
import HomePage from "./Component/Home";
import Monthly from "./Component/Monthly";
import WatchHistory from './Component/WatchHistory';

const App = () => {
  const navItems = [
    { path: '/homepage', label: 'Home', icon: Home },
    { path: '/weekly', label: 'Weekly', icon: Calendar },
    { path: '/hourly', label: 'Hourly', icon: Clock },
    { path: '/monthly', label: 'Monthly', icon: BarChart3 },
    { path: '/watchHistory', label: 'History', icon: History },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="text-3xl">📺</div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  WatchTracker
                </span>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </NavLink>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button className="text-gray-300 hover:text-white p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden pb-4 space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path='/' element={<Navigate to="/homepage" replace />} />
              <Route path="/homepage" element={<HomePage />} />
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