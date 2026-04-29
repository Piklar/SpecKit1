const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.send('AgriKlima API is running...');
});

// Setup routes
const setCacheHeaders = require('./middleware/cache');

// Setup routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/weather', setCacheHeaders(3600), require('./routes/weather'));
app.use('/api/crops', setCacheHeaders(86400), require('./routes/crops')); // Cache for 1 day
app.use('/api/pests', require('./routes/pests'));
app.use('/api/farm', require('./routes/farm'));
app.use('/api/calendar', setCacheHeaders(86400), require('./routes/calendar'));
app.use('/api/news', setCacheHeaders(3600), require('./routes/news'));

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
