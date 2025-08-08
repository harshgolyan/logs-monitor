import express from "express";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.get("/", (req, res) => {
    res.send("Hello World! This is the log monitoring server.");
});

const logFilePath = path.join(__dirname, "logs", "server.log");

if (!fs.existsSync(logFilePath)) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    fs.writeFileSync(logFilePath, "");
}

fs.watch(logFilePath, (eventType) => {
    if (eventType === "change") {
        const data = fs.readFileSync(logFilePath, "utf-8");
        const lines = data.trim().split("\n");
        const lastLine = lines[lines.length - 1]; // Get the newest log line
        io.emit("logUpdate", lastLine);
    }
});

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    const data = fs.readFileSync(logFilePath, "utf-8");
    const lines = data.trim().split("\n");
    const lastLines = lines.slice(-10);
    socket.emit("logInit", lastLines);

    socket.on("message", (msg) => {
        console.log("Message from client:", msg);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

httpServer.listen(3000, () => {
    console.log("Server is running on port 3000 🚀");
});
