const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("./index");

// Create a test JWT token
const payload = { user: "ecommerce" };
const secretKey = "default_secret_key";
const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

describe("GET /", () => {
  it("should return welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Welcome to the e-commerce API!");
  });
});

describe("POST /products", () => {
  it("should create a new product", async () => {
    const response = await request(app)
      .post("/products")
      .set("Authorization", `${token}`)
      .send({
        name: "Test Product",
        description: "This is a test product",
        price: 29.99,
        stock_quantity: 50,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "Test Product");
  });

  it("should return 401 if not authenticated", async () => {
    const response = await request(app).post("/products").send({
      name: "Test Product",
      description: "This is a test product",
      price: 29.99,
      stock_quantity: 50,
    });

    expect(response.status).toBe(401);
  });
});

describe("GET /products", () => {
  it("should get all products", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("GET /products/:id", () => {
  it("should get a single product by ID", async () => {
    const response = await request(app)
      .get("/products/25")
      .set("Authorization", `${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 25);
  });

  it("should handle product not found", async () => {
    const response = await request(app)
      .get("/products/999")
      .set("Authorization", `${token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Product not found");
  });
});

describe("PUT /products/:id", () => {
  it("should update a product by ID", async () => {
    const response = await request(app)
      .put("/products/26")
      .set("Authorization", `${token}`)
      .send({
        name: "Updated Product",
        description: "This is an updated product",
        price: 39.99,
        stock_quantity: 60,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Updated Product");
  });

  it("should handle product not found", async () => {
    const response = await request(app)
      .put("/products/999")
      .set("Authorization", `${token}`)
      .send({
        name: "Updated Product",
        description: "This is an updated product",
        price: 39.99,
        stock_quantity: 60,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Product not found");
  });
});

describe("DELETE /products/:id", () => {
  it("should delete a product by ID", async () => {
    const response = await request(app)
      .delete("/products/20")
      .set("Authorization", `${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Product deleted successfully"
    );
  });

  it("should handle product not found", async () => {
    const response = await request(app)
      .delete("/products/999")
      .set("Authorization", `${token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Product not found");
  });
});

describe("GET /products-paginated", () => {
  it("should get all products with pagination and sorting", async () => {
    const response = await request(app).get("/products-paginated");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
