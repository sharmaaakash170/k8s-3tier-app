const express = require('express');
const mongoose = require('mongoose');
const client = require('prom-client');

const app = express();
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongodb:27017/mydb';
const PORT = process.env.PORT || 3000;

// ---- Prometheus setup ----
// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default metrics collection (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Create an HTTP request counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestCounter);

// ---- MongoDB connection ----
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// ---- Metrics endpoint ----
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// ---- Instrumented API route ----
app.get('/api/data', async (req, res) => {
  // Increment counter for this route
  const route = req.route.path;
  try {
    const data = {
      message: 'Hello from Backend API',
      dbConnected: mongoose.connection.readyState === 1,
    };
    res.json(data);
    httpRequestCounter.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
  } catch (err) {
    httpRequestCounter.inc({
      method: req.method,
      route,
      status_code: 500,
    });
    res.status(500).json({ error: err.message });
  }
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`);
});
