const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Any other routes (e.g., backend API routes) can be defined here

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
