import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * ✅ Employee Login Route
 */
router.post("/employeelogin", (req, res) => {
  const sql = "SELECT * FROM employee WHERE email = ?";
  
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });

    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });

        if (response) {
          const { id, email, name, image } = result[0];
          const token = jwt.sign(
            { role: "employee", email, id },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );

          res.cookie("token", token);
          return res.json({ loginStatus: true, id, name, email, image });
        } else {
          return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
      });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

/**
 * ✅ Fetch Employee Details
 */
router.get('/detail/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?"; // Ensure correct SQL query
  con.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ Status: false, Error: "Database error" });
    if (result.length === 0) return res.status(404).json({ Status: false, Error: "Employee not found" });
    return res.json(result[0]); // Return only the first matching employee
  });
});

/**
 * ✅ Employee Logout
 */
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true });
});

export { router as EmployeeRouter }; // ✅ Ensure correct export
