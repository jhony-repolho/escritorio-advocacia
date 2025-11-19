import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Determine the static files path
  const staticPath = path.resolve(__dirname, "..", "dist", "public");

  console.log(`[Server] Static path: ${staticPath}`);
  console.log(`[Server] Directory exists: ${fs.existsSync(staticPath)}`);

  // Serve static files
  app.use(express.static(staticPath, { maxAge: "1h" }));

  // SPA fallback - serve index.html for all routes
  app.get("*", (req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    console.log(`[Server] Serving ${req.path} -> ${indexPath}`);
    
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`[Server] Error serving index.html: ${err}`);
        res.status(404).send("Not found");
      }
    });
  });

  const port = parseInt(process.env.PORT || "3000", 10);

  server.listen(port, "0.0.0.0", () => {
    console.log(`[Server] ✓ Running on port ${port}`);
    console.log(`[Server] ✓ Static files: ${staticPath}`);
  });
}

startServer().catch((err) => {
  console.error("[Server] ✗ Failed to start:", err);
  process.exit(1);
});
