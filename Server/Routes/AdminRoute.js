import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * ✅ Admin Login
 */
router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ?";
  
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });

    if (result.length > 0) {
      const { id, email } = result[0];
      const token = jwt.sign({ role: "admin", email, id }, "jwt_secret_key", {
        expiresIn: "1d",
      });

      res.cookie("token", token, { httpOnly: true, secure: true });
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

/**
 * ✅ Fetch All Assets (For Admin & Employee View)
 */
router.get("/assets", (req, res) => {
  con.query("SELECT * FROM assets", (err, result) => {
    if (err) return res.json({ Status: false, Error: "Database Error" });
    return res.json({ Status: true, Result: result });
  });
});

/**
 * ✅ Fetch My Assets (Employee-Specific)
 */
router.get("/my_assets/:liable_person", (req, res) => {
  const { liable_person } = req.params;

  const sql = "SELECT * FROM assets WHERE liable_person = ?";
  con.query(sql, [liable_person], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Database Error" });
    return res.json({ Status: true, Result: result });
  });
});
/** ✅ Fetch Assets Assigned to a Specific Employee */
router.get("/my_assets/:employee_name", (req, res) => {
  const { employee_name } = req.params;
  
  const sql = "SELECT asset_name, current_holder FROM assets WHERE liable_person = ?";
  
  con.query(sql, [employee_name], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Database Error!" });
    return res.json({ Status: true, Result: result });
  });
});


/**
 * ✅ Add Asset (Admin Only)
 */
router.post("/add_asset", (req, res) => {
  const { asset_name, asset_type, stock, date_issued, liable_person, serial_number } = req.body;

  const sql = "INSERT INTO assets (asset_name, asset_type, stock, date_issued, liable_person, serial_number, status, current_holder) VALUES (?, ?, ?, ?, ?, ?, 'Available', NULL)";
  
  con.query(sql, [asset_name, asset_type, stock, date_issued, liable_person, serial_number], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Insertion Error!" });
    return res.json({ Status: true, Message: "Asset Added Successfully!" });
  });
});

/**
 * ✅ Delete Asset (Admin Only)
 */
router.delete("/delete_asset/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM assets WHERE id = ?";
  
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Deletion Error!" });
    return res.json({ Status: true, Message: "Asset Deleted Successfully!" });
  });
});

/**
 * ✅ Request Asset (Employee)
 * Sends a request to the asset owner (liable_person)
 */
router.post("/request_asset", (req, res) => {
  const { asset_id, asset_name, requested_by, liable_person } = req.body;

  const sql = "INSERT INTO asset_requests (asset_id, asset_name, requested_by, liable_person, status) VALUES (?, ?, ?, ?, 'Pending')";

  con.query(sql, [asset_id, asset_name, requested_by, liable_person], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Database Error" });
    return res.json({ Status: true, Message: "Asset request sent successfully" });
  });
});

/**
 * ✅ Fetch All Asset Requests (Admin & Employees)
 */
router.get("/asset_requests", (req, res) => {
  const sql = "SELECT * FROM asset_requests";

  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Database Error" });
    return res.json({ Status: true, Result: result });
  });
});

/**
 * ✅ Fetch Asset Requests for Specific Liable Person
 */
router.get("/asset_requests/:liable_person", (req, res) => {
  const { liable_person } = req.params;

  const sql = "SELECT * FROM asset_requests WHERE liable_person = ?";
  con.query(sql, [liable_person], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Database Error" });
    return res.json({ Status: true, Result: result });
  });
});

/**
 * ✅ Approve or Reject Asset Request (Admin Only)
 */
router.post("/update_asset_request", (req, res) => {
  const { request_id, status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.json({ Status: false, Error: "Invalid status" });
  }

  const sql = "UPDATE asset_requests SET status = ? WHERE id = ?";
  con.query(sql, [status, request_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Database Error" });

    return res.json({ Status: true, Message: `Asset request ${status} successfully` });
  });
});

/**
 * ✅ Delete Asset Request (Admin Only)
 */
router.delete("/delete_asset_request/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM asset_requests WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Database Error" });
    return res.json({ Status: true, Message: "Asset request deleted successfully" });
  });
});

/**notifications */
router.post("/submit_indent", (req, res) => {
  const {
      name_and_designation_of_the_indenter,
      personal_file_no,
      office_project,
      project_no_and_title,
      budget_head,
      items_head,
      type_of_purchase,
      issue_gst_exemption_certificate,
      item_details,
      requested_by
  } = req.body;

  console.log("📝 Submitting Indent Request from:", name_and_designation_of_the_indenter);

  const hardCodedTeamLeadId = 37;  // Your fixed TeamLead ID (can be dynamic if needed)

  const itemDetailsJson = JSON.stringify(item_details);  // Convert items array to JSON string

  const insertIndentSql = `
      INSERT INTO indent_requests 
      (
          name_and_designation_of_the_indenter, 
          personal_file_no, 
          office_project, 
          project_no_and_title,
          budget_head, 
          items_head, 
          type_of_purchase, 
          issue_gst_exemption_certificate,
          item_details, 
          justification_of_procurement,
          teamlead_id,
          requested_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?)
  `;

  const indentValues = [
      name_and_designation_of_the_indenter,
      personal_file_no,
      office_project,
      project_no_and_title,
      budget_head,
      items_head,
      type_of_purchase,
      issue_gst_exemption_certificate,
      itemDetailsJson,
      hardCodedTeamLeadId,
      requested_by
  ];

  con.query(insertIndentSql, indentValues, (err, result) => {
      if (err) {
          console.error("❌ Database Error:", err);
          return res.json({ success: false, message: "Failed to submit indent request." });
      }

      const indentId = result.insertId;
      console.log("✅ Indent Submitted with ID:", indentId);

      // ✅ Create Notification for TeamLead
      const notificationSql = `
          INSERT INTO notifications (indent_id, receiver_id, message, recipient_role, is_read, created_at)
          VALUES (?, ?, ?, 'TeamLead', 0, NOW())
      `;

      const message = `New Indent Request from ${name_and_designation_of_the_indenter} requires your review.`;

      con.query(notificationSql, [indentId, hardCodedTeamLeadId, message], (notificationErr) => {
          if (notificationErr) {
              console.error("❌ Notification Insert Error:", notificationErr);
              return res.json({ success: false, message: "Indent saved but failed to create notification." });
          }

          console.log("✅ Notification Created for TeamLead ID:", hardCodedTeamLeadId);
          return res.json({ success: true, message: "Indent submitted successfully and TeamLead notified." });
      });
  });
});




/**
 * ✅ Admin Logout
 */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true, Message: "Logged out successfully" });
});

// ✅ Correct export
export { router as adminRouter };