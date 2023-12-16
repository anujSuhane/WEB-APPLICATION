import express from 'express';
import mysql from 'mysql2';

const app = express();
const PORT = 3000;

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'sql1234',
  database: 'orders',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

// Middleware to parse JSON requests
app.use(express.json());

// Create a new product
app.post('/products', async (req, res) => {
  try {
    const { PRODUCT_ID, OWNER_PARTY_ID, PRODUCT_NAME, DESCRIPTION, CHARGE_SHIPPING, RETURNABLE } = req.body;
    const createProductQuery = `
      INSERT INTO product (PRODUCT_ID, OWNER_PARTY_ID, PRODUCT_NAME, DESCRIPTION, CHARGE_SHIPPING, RETURNABLE)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await pool.query(createProductQuery, [PRODUCT_ID, OWNER_PARTY_ID, PRODUCT_NAME, DESCRIPTION, CHARGE_SHIPPING, RETURNABLE]);

    res.status(201).json({ message: 'Product created successfully', productId: PRODUCT_ID });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const getProductsQuery = 'SELECT * FROM product';
    const [rows] = await pool.query(getProductsQuery);

    res.json({ products: rows });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a specific product by ID
app.get('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const getProductQuery = 'SELECT * FROM product WHERE PRODUCT_ID = ?';
    const [rows] = await pool.query(getProductQuery, [productId]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json({ product: rows[0] });
    }
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a product
app.put('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { PRODUCT_NAME, DESCRIPTION, CHARGE_SHIPPING, RETURNABLE } = req.body;
    const updateProductQuery = `
      UPDATE product
      SET PRODUCT_NAME = ?, DESCRIPTION = ?, CHARGE_SHIPPING = ?, RETURNABLE = ?
      WHERE PRODUCT_ID = ?
    `;
    const result = await pool.query(updateProductQuery, [PRODUCT_NAME, DESCRIPTION, CHARGE_SHIPPING, RETURNABLE, productId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json({ message: 'Product updated successfully', productId });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a product
app.delete('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const deleteProductQuery = 'DELETE FROM product WHERE PRODUCT_ID = ?';
    const result = await pool.query(deleteProductQuery, [productId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json({ message: 'Product deleted successfully', productId });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
