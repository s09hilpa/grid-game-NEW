import express from "express";
import knex from "knex";

// Set up express server
const app = express();
app.use(express.json()); // Support JSON content types in requests

// Serve frontend files from the app directory
// 👀 Note: This needs to be updated to the path of your frontend directory
app.use(express.static("../Grid-game"));

// Set up database - Creates an instance of the Knex library
// connected to our SQLite database file.
const db = knex({
  client: "sqlite3",
  connection: { filename: "./database.db" },
  useNullAsDefault: true, // Required for SQLite
});

// GET endpoint for listing data from a database
app.get("/cards", async function (request, response) {
  const rows = await db.raw("SELECT * FROM cards");
  response.json(rows); // Respond with the data in JSON format
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

// Start the server on port 3000 on your local machine
const server = app.listen(3000, function () {
  console.log("App running on http://localhost:3000. Type Ctrl+C to stop.");
});

// Show errors when the server fails to start
server.on("error", function (error) {
  console.error("Server error:", error.message);
});
