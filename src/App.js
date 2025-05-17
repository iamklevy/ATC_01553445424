import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Congratulations from "./pages/Congratulations";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    alert("You are not authorized to access this page.");
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/congratulations" element={<Congratulations />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
