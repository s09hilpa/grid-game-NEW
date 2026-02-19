import express from "express";
import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up express server
const app = express();
app.use(express.json()); // Support JSON content types in requests

// Serve frontend files from the app directory
// 👀 Note: This needs to be updated to the path of your frontend directory
app.use(express.static(__dirname));

// Set up database - Creates an instance of the Knex library
// connected to our SQLite database file.
const db = knex({
  client: "sqlite3",
  connection: { filename: "./database.db" },
  useNullAsDefault: true, // Required for SQLite
});

//GET endpoint to fetch all cards from the database
app.get("/cards", async function (request, response) {
  try {
    const cards = await db("cards").select("*");
    response.json(cards); // Send cards as JSON
  } catch (error) {
    console.error("Error fetching cards:", error);
    response.status(500).json({ error: "Failed to fetch cards" });
  }
});

// Use PORT from environment variable (Render provides this automatically)
// Falls back to 3000 for local development
const PORT = process.env.PORT || 3000;

// Start the server on 0.0.0.0 to accept connections from anywhere
const server = app.listen(PORT, "0.0.0.0", function () {
  console.log(`App running on port ${PORT}`);
});

// Show errors when the server fails to start
server.on("error", function (error) {
  console.error("Server error:", error.message);
});
