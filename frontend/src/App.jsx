// import React from 'react';
// import Weekly from "./Weekly";
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Home from "./Component/Home";
// const App = () => {
//     return (
//         <div className="dashboard-container">
//             <Router>
//                 <Link to="/weekly"> <button>Weekly</button>
//                 </Link>
//                 <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/weekly" element={<Weekly />} />
//                 </Routes>
//             </Router>
//         </div>

//     );
// };

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Weekly from "./Weekly";
import Home from "./Component/Home";
import './App.css'; // Create or update this CSS file

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-logo">📺 WatchTracker</div>
          <div className="nav-links">
            <NavLink exact="true" to="/" className="nav-link" activeclassname="active">Home</NavLink>
            <NavLink to="/weekly" className="nav-link" activeclassname="active">Weekly</NavLink>
          </div>
        </nav>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weekly" element={<Weekly />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
