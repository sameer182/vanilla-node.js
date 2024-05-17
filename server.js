/**
 *  Creates and starts HTTP server
 *  Serves static files
 *  Handles basic routing.
 * 
 */

import http from "http";
import fs from "fs/promises";
import path from "path";
import url from "url";

// File path
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log(__dirname);
// console.log(__filename);

const PORT = process.env.PORT;

const server = http.createServer(async (req, res) => {
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/html');
  try {
    // Check if GET request
    if (req.method === "GET") {
      let filePath;

      if (req.url === "/") {
        filePath = path.join(__dirname, "public", "index.html");
      } else if (req.url === "/about") {
        filePath = path.join(__dirname, "public", "about.html");
      } else if (req.url === "/contact") {
        filePath = path.join(__dirname, "public", "contact.html");
      } else {
        // If no route display 404
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>Page Not Found</h1>");
        return;
      }

      const data = await fs.readFile(filePath);
      res.setHeader("Content-Type", "text/html");
      res.write(data);
      res.end();
    } else {
      // Respond 405 for non-GET request
      res.writeHead(405, { "Content-Type": "text/html" });
      res.end("Method not allowed");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}...`);
});
