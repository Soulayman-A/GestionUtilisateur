import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import Admin from "./pages/admin/admin";

const RoutesIndex = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default RoutesIndex;
