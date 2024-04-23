import "./App.css";

import { AuthProvider } from "./auth/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from './pages/Login';
import Profile from './pages/Profile';
import NavBarPage from './components/NavBar';
import Marketplace from './pages/Marketplace';
import Register from './pages/Register';

function App() {

  return (
    <Router>
      <AuthProvider>
          <Routes>
            {/* Routes with nav bar */}
            <Route element={<NavBarPage />}>
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/marketplace" element={<Marketplace />} />
            </Route>
            {/* Routes without nav bar */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/" element={<Navigate to='/login' />} />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
