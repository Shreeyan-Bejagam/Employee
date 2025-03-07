import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeLogin from './Components/Login';
import Dashboard from './Components/Dashboard';
import EmployeeHome from './Components/EmployeeHome';
import Tasks from './Components/Tasks';
import Assets from './Components/Assets';
import AssetRequests from './Components/AssetRequests';
import Attendance from './Components/Attendance';
import IndentForm from './Components/IndentForm';  // ✅ Import the new IndentForm component
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("user");
      const storedUser = storedUserData ? JSON.parse(storedUserData) : null;

      if (storedUser) {
        console.log("🔍 Debug: User Data Found in LocalStorage", storedUser);
        setUser(storedUser);
      } else {
        console.log("❌ No User Found in LocalStorage");
      }
    } catch (error) {
      console.error("🚨 Failed to parse user data from localStorage:", error);
      localStorage.removeItem("user"); // Clear corrupt data to recover gracefully
      setUser(null);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeLogin setUser={setUser} />} />
        <Route path="/employeelogin" element={<EmployeeLogin setUser={setUser} />} />

        {/* Employee Dashboard with Nested Routes */}
        <Route path="/dashboard" element={<Dashboard user={user} />}>
          <Route index element={<EmployeeHome />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="assets" element={<Assets />} />
          <Route path="asset_requests" element={<AssetRequests user={user} />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>

        {/* ✅ New route for the Indent Form */}
        <Route path="/request-indent" element={<IndentForm />} />
      </Routes>
    </Router>
  );
}

export default App;
