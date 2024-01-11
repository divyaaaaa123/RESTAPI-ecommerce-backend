# RESTFUL E-commerce API

Welcome to the E-commerce API! This API provides basic CRUD operations for managing products in an e-commerce system. It is built using the following technologies:
- **Node.js:** A JavaScript runtime for building server-side applications.
- **Express:** A minimal and flexible Node.js web application framework.
- **JSON Web Tokens (JWT):** Used for authentication to secure API endpoints.
- **PostgreSQL:** A powerful, open-source relational database system.
- **Jest:** A delightful JavaScript testing framework.
- **Supertest:** A library for testing HTTP assertions.
  
## Getting Started

To run this API, make sure you have Node.js and PostgreSQL installed on your system. Follow these steps:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up a PostgreSQL database and update the connection details in the code or use environment variables.
4. Run the server: `npm start`

## JWT Authentication

The API uses JSON Web Tokens (JWT) for authentication. A default JWT token is created with a predefined payload and secret key. You can customize the payload and secret key based on your requirements.

## Endpoints

### 1. Root Path

- **URL:** `/`
- **Method:** `GET`
- **Description:** Returns a welcome message.
- `curl -X GET http://localhost:3000/ `


### 2. Create a New Product

- **URL:** `/products`
- **Method:** `POST`
- **Description:** Creates a new product.
- **Authentication:** Requires a valid JWT token.
- `curl -X POST -H "Authorization: <your-token>" -H "Content-Type: application/json" -d '{
  "name": "Test Product",
  "description": "This is a test product",
  "price": 29.99,
  "stock_quantity": 50
}' http://localhost:3000/products
`

### 3. Get All Products

- **URL:** `/products`
- **Method:** `GET`
- **Description:** Retrieves a list of all products.
- `curl -X GET http://localhost:3000/products`


### 4. Get a Single Product by ID

- **URL:** `/products/:id`
- **Method:** `GET`
- **Description:** Retrieves a single product by its ID.
- `curl -X GET -H "Authorization: <your-token>" http://localhost:3000/products/25`


### 5. Update a Product by ID

- **URL:** `/products/:id`
- **Method:** `PUT`
- **Description:** Updates a product by its ID.
- **Authentication:** Requires a valid JWT token.
- `curl -X PUT -H "Authorization: <your-token>" -H "Content-Type: application/json" -d '{
  "name": "Updated Product",
  "description": "This is an updated product",
  "price": 39.99,
  "stock_quantity": 60
}' http://localhost:3000/products/26
`

### 6. Delete a Product by ID

- **URL:** `/products/:id`
- **Method:** `DELETE`
- **Description:** Deletes a product by its ID.
- **Authentication:** Requires a valid JWT token.
- `curl -X DELETE -H "Authorization: <your-token>" http://localhost:3000/products/20`


### 7. Get All Products with Pagination and Sorting

- **URL:** `/products-paginated`
- **Method:** `GET`
- **Description:** Retrieves a paginated and sorted list of products.
- `curl -X GET http://localhost:3000/products-paginated?page=1&limit=10&sortBy=id&sortOrder=asc
`

## Error Handling

The API includes basic error handling. If an error occurs, a generic "Internal Server Error" response is sent with a status code of 500.

## Testing

The API includes test cases to ensure proper functionality. To run tests:

1. Make sure the server is not running (`npm start`).
2. Run tests: `npm test

## Dockerization

To containerize the application using Docker, follow these steps:

1. Create a Dockerfile in the root of your project. Copy and paste the following content into the Dockerfile:

    ```Dockerfile
    FROM node:14

    WORKDIR /usr/src/app

    COPY package*.json ./

    RUN npm install

    COPY . .

    EXPOSE 3000

    CMD ["node", "index.js"]
    ```

2. Build the Docker image:

    ```bash
    docker build -t e-commerce-api .
    ```

3. Run the Docker container:

    ```bash
    docker run -p 3000:3000 e-commerce-api
    ```

   The `-p` flag maps port 3000 on your local machine to port 3000 in the Docker container.

Now your E-commerce API is containerized and can be run in any environment with Docker support. Ensure you have Docker installed on your system to follow these steps.

**Note:** The provided Dockerfile assumes your application listens on port 3000. If your application uses a different port, update the `EXPOSE` statement and the port mapping accordingly.


