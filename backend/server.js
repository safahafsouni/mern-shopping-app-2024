// server.js
const express = require('express');
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDb = require('./config/db');
const productRoutes = require('./routes/product.route');
const userRoutes = require('./routes/user.route');
const orderRoutes = require('./routes/order.route');
const categoryRoutes = require('./routes/category.route');
const { errorHandler } = require('./middlewares/error.middleware');

dotenv.config(); // Load environment variables

connectDb(); // Connect to the database

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(errorHandler);

app.use('/api/product', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/category', categoryRoutes);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
