import React, { useState } from "react";
import "./style.css";

const Tasks = () => {
  // Sample Task Data
  const [tasks, setTasks] = useState([
    { id: 1, task: "Complete Report", priority: "High", time: "10:30 AM", date: "2025-02-12" },
    { id: 2, task: "Prepare Presentation", priority: "Medium", time: "02:00 PM", date: "2025-02-14" },
    { id: 3, task: "Submit Documentation", priority: "Low", time: "05:00 PM", date: "2025-02-16" }
  ]);

  // File Upload Handling
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && ["application/pdf", "application/vnd.ms-powerpoint", "application/msword"].includes(uploadedFile.type)) {
      setFile(uploadedFile);
      alert("✅ File uploaded successfully!");
    } else {
      alert("❌ Invalid file type! Only .pdf, .ppt, .doc files are allowed.");
    }
  };

  return (
    <div className="tasks-container">
      <h3 className="section-title">📌 Tasks</h3>
      
      {/* Tasks Table */}
      <div className="task-table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Priority</th>
              <th>Submission Time</th>
              <th>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.task}</td>
                  <td className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</td>
                  <td>{task.time}</td>
                  <td>{task.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-tasks">No tasks assigned</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* File Upload Section */}
      <div className="upload-section">
        <h4 className="upload-title">📤 Upload Files</h4>
        <input type="file" accept=".pdf,.ppt,.doc" onChange={handleFileUpload} />
        {file && <p className="uploaded-file">📄 {file.name}</p>}
      </div>
    </div>
  );
};

export default Tasks;
