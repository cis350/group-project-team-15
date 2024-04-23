import "./App.css";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { AuthProvider } from "./auth/AuthContext";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
