const express = require('express');
const mongoose = require('mongoose');
const app = express();

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongodb:27017/mydb';

// Connect to MongoDB
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from Backend API', dbConnected: mongoose.connection.readyState === 1 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend API listening on port ${PORT}`);
});
