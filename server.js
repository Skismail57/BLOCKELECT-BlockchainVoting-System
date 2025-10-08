const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Disable caching for all responses
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
});

// Serve static files from src
app.use(express.static(path.join(__dirname, "src")));

// Serve static files from dist
app.use("/dist", express.static(path.join(__dirname, "dist")));

// Serve index.html for all routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});