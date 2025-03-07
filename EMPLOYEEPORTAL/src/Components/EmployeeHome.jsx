import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import './style.css';
const EmployeeHome = () => {
  const [date, setDate] = useState(new Date());
  const tasks = [
    "Triple Riding Violation",
    "Design Employee Portal",
    "Helmet Detection",
  ];

  // Dummy attendance data (Date vs Time)
  const attendanceData = {
    labels: ["1/2/25", "2/2/25", "3/2/25", "4/2/25", "5/2/25"],
    datasets: [
      {
        label: "Check-in Time",
        data: ["9:25", "9:30", "9:35", "9:40", "9:45"],
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div className="container mt-4">
      {/* Top Section: Leaves & Calendar */}
      <div className="row">
        {/* Total Leaves */}
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5>Total Leaves</h5>
            <h3>6</h3>
          </div>
        </div>

        {/* Lates & Leaves Remaining */}
        <div className="col-md-4">
          <div className="card text-center p-3">
            <h5>No. of Lates</h5>
            <h3>0</h3>
            <hr />
            <h5>Leaves Remaining</h5>
            <h3>5</h3>
          </div>
        </div>

        {/* Calendar */}
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Calendar</h5>
            <Calendar onChange={setDate} value={date} />
          </div>
        </div>
      </div>

      {/* Bottom Section: Tasks & Attendance Graph */}
      <div className="row mt-4">
        {/* Tasks To-Do */}
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Tasks To-Do</h5>
            <ul className="list-group">
              {tasks.map((task, index) => (
                <li key={index} className="list-group-item">
                  <input type="checkbox" className="me-2" /> {task}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Attendance Graph */}
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Attendance</h5>
            <Line data={attendanceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
