import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./style.css";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(null);
  const [leaveDetails, setLeaveDetails] = useState({
    reason: "",
    startDate: "",
    endDate: "",
    totalDays: "",
  });

  const [permissionDetails, setPermissionDetails] = useState({
    reason: "",
    outTime: "",
    inTime: "",
    reachedTime: "",
  });

  const handleLeaveChange = (e) => {
    setLeaveDetails({ ...leaveDetails, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (e) => {
    setPermissionDetails({ ...permissionDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="attendance-container">
      <h3 className="dashboard-title"> Attendance Dashboard</h3>

      {/* Attendance Summary Cards */}
      <div className="attendance-summary">
        <div className="summary-box">
          <strong>🏢 No. of Working Days:</strong>
          <p>30</p>
        </div>
        <div className="summary-box">
          <strong>✅ No. of Present Days:</strong>
          <p>26</p>
        </div>
        <div className="summary-box">
          <strong>🟢 No. of Leaves Available:</strong>
          <p>4</p>
        </div>
      </div>

      {/* Attendance Calendar & Upcoming Holidays */}
      <div className="attendance-grid">
        <div className="calendar-section">
          <h4>📆 Attendance</h4>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>

        {/* Upcoming Holidays Section */}
        <div className="holidays-section">
          <h4>📆 Upcoming Holidays</h4>
          <ul>
            <li>🎉 <strong>25-Feb:</strong> Employee Appreciation Day</li>
            <li>🏖️ <strong>08-Mar:</strong> Women's Day (Optional Leave)</li>
          </ul>
        </div>
      </div>

      {/* Leave Request & Permission Dropdown */}
      <div className="leave-dropdown">
        <select onChange={(e) => setShowForm(e.target.value)}>
          <option value="">Request Leave or Permission</option>
          <option value="leave">Request Leave</option>
          <option value="permission">Request Permission</option>
        </select>
      </div>

      {/* Leave Request Form */}
      {showForm === "leave" && (
        <div className="leave-form">
          <h4>📝 Leave Request Form</h4>
          <label>Reason for Leave:</label>
          <input type="text" name="reason" value={leaveDetails.reason} onChange={handleLeaveChange} />

          <label>Start Date:</label>
          <input type="date" name="startDate" value={leaveDetails.startDate} onChange={handleLeaveChange} />

          <label>End Date:</label>
          <input type="date" name="endDate" value={leaveDetails.endDate} onChange={handleLeaveChange} />

          <label>Total Days:</label>
          <input type="number" name="totalDays" value={leaveDetails.totalDays} onChange={handleLeaveChange} />

          <button onClick={() => alert("✅ Leave Request Submitted!")}>Submit</button>
        </div>
      )}

      {/* Permission Request Form */}
      {showForm === "permission" && (
        <div className="permission-form">
          <h4>📝 Permission Request Form</h4>
          <label>Reason for Permission:</label>
          <input type="text" name="reason" value={permissionDetails.reason} onChange={handlePermissionChange} />

          <label>Out Time:</label>
          <input type="time" name="outTime" value={permissionDetails.outTime} onChange={handlePermissionChange} />

          <label>In Time:</label>
          <input type="time" name="inTime" value={permissionDetails.inTime} onChange={handlePermissionChange} />

          <label>Reached Time:</label>
          <input type="time" name="reachedTime" value={permissionDetails.reachedTime} onChange={handlePermissionChange} />

          <button onClick={() => alert("✅ Permission Request Submitted!")}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Attendance;
