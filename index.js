// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

// Define JWT payload and secret key
const payload = {
  user: "ecommerce",
};
const secretKey = "default_secret_key";

// Create a JWT token
const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
// console.log(token);  // For API testing

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ecommerce",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
});

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Use body-parser middleware
app.use(bodyParser.json());

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Define a route for the root path
app.get("/", (req, res) => {
  res.send("Welcome to the e-commerce API!");
});

// CRUD operations

// Create a new product
app.post("/products", authenticate, async (req, res) => {
  try {
    const { name, description, price, stock_quantity } = req.body;
    const result = await pool.query(
      "INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, stock_quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      productId,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a product by ID
app.put("/products/:id", authenticate, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, price, stock_quantity } = req.body;
    const result = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4 WHERE id = $5 RETURNING *",
      [name, description, price, stock_quantity, productId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a product by ID
app.delete("/products/:id", authenticate, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [productId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all products with pagination and sorting
app.get("/products-paginated", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "id",
      sortOrder = "asc",
    } = req.query;
    const offset = (page - 1) * limit;

    const queryString = `
      SELECT * FROM products
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(queryString, [limit, offset]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const server = app.listen(PORT, () => {
  //   console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = server;
