const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // Bind to all interfaces for Render

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Fallback to index.html for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
app.use(express.static(path.join(__dirname, 'public')));
