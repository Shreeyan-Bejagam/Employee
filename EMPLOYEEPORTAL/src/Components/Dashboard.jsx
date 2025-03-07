import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const Dashboard = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  // Fetch Employee Details
  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    console.log("🔍 Stored Employee ID in localStorage:", employeeId); // ✅ Debugging Log

    if (!employeeId) {
      console.error("🚨 No Employee ID found in localStorage.");
      navigate("/employeelogin");
      return;
    }

    const apiUrl = `http://localhost:3001/employee/detail/${employeeId}`;

    console.log("📡 Fetching Employee Data from:", apiUrl); // ✅ Debugging Log

    axios.get(apiUrl)
      .then((response) => {
        console.log("✅ Employee Data Fetched:", response.data);
        if (response.data) {
          setEmployee(response.data);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching employee data:", err);
      });
  }, [navigate]);



  // Handle Logout
  const handleLogout = () => {
    axios.get("http://localhost:3001/employee/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("employeeId");
          navigate("/employeelogin");
        } else {
          alert("Logout failed! Please try again.");
        }
      })
      .catch((err) => {
        console.error("Logout Error:", err);
        alert("An error occurred during logout. Please try again.");
      });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar with Fixed Profile */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark min-vh-100">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-white">

            {/* Employee Profile Section */}
            {employee && (
              <div className="text-center mt-2">
                <img
                  src={`http://localhost:3000/images/${employee.image}`}
                  alt="Employee Profile"
                  className="rounded-circle"
                  style={{ width: "80px", height: "80px" }}
                />



                <h5 className="mt-2">{employee.name}</h5>
              </div>
            )}

            {/* Sidebar Navigation */}
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start mt-4">
              <li className="w-100">
                <Link to="/dashboard" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-speedometer2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/tasks" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-list-task"></i>
                  <span className="ms-2 d-none d-sm-inline">Tasks</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/assets" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-box"></i>
                  <span className="ms-2 d-none d-sm-inline">Assets</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/asset_requests" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-clipboard-check"></i>
                  <span className="ms-2 d-none d-sm-inline">Asset Requests</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/attendance" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-calendar-check"></i>
                  <span className="ms-2 d-none d-sm-inline">Attendance</span>
                </Link>
              </li>
              <li className="w-100">
                <button className="btn nav-link text-white px-3 d-flex align-items-center" onClick={handleLogout} style={{ background: "none", border: "none" }}>
                  <i className="fs-4 bi-power"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col p-0 m-0 offset-md-3">
          <div className="p-3 d-flex justify-content-center shadow">
            <h4>Employee Dashboard</h4>
          </div>
          <Outlet context={{ user: employee }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
