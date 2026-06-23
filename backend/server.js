console.log("server.js started");

// Import Express framework
const express = require("express");

// Allow React frontend to talk to backend
const cors = require("cors");

// Import MySQL connection
const db = require("./db/db");

// Create Express app
const app = express();

// Allow JSON data in requests
app.use(express.json());

// Enable CORS
app.use(cors());


app.get("/", (req, res) => {
  res.send("Backend Running");
});


app.get("/users", (req, res) => {

  const sql = "SELECT * FROM users";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});


app.post("/users", (req, res) => {

  // Get data sent from React
  const { name, email } = req.body;

  const sql =
    "INSERT INTO users(name, email) VALUES (?, ?)";

  db.query(
    sql,
    [name, email],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "User Added Successfully"
      });

    }
  );

});


app.delete("/users/:id", (req, res) => {

  // Get id from URL
  const id = req.params.id;

  const sql =
    "DELETE FROM users WHERE id = ?";

  db.query(
    sql,
    [id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "User Deleted Successfully"
      });

    }
  );

});

// Update an existing user
app.put("/users/:id", (req, res) => {

  // Get id from URL
  const id = req.params.id;

  // Get updated data from React
  const { name, email } = req.body;

  const sql =
    "UPDATE users SET name = ?, email = ? WHERE id = ?";

  db.query(
    sql,
    [name, email, id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "User Updated Successfully"
      });

    }
  );

});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});