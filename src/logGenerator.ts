import fs from "fs";
import path from "path";

const logFile = path.join(__dirname, "logs","server.log");

function appendLog() {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] Random log message ${Math.floor(Math.random() * 100)}\n`;
  
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error("Error writing log:", err);
  });
}

setInterval(appendLog, 3000);

console.log("Log generator started. Writing logs every 3 seconds...");
