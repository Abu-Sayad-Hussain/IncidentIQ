const { io } = require("socket.io-client");
const { execSync } = require("child_process");

const socket = io("http://localhost:3003", {
  reconnectionDelayMax: 10000,
});

socket.on("connect", () => {
  console.log("✅ Successfully connected! Socket ID:", socket.id);
  
  console.log("Sending POST payload...");
  try {
    execSync(`curl -s -X POST http://localhost:3000/api/logs -H "Content-Type: application/json" -d '{"serviceName": "auth-service", "level": "ERROR", "message": "Testing Spike Graph", "timestamp": "2026-04-27T12:00:00Z"}'`);
    console.log("POST sent.");
  } catch (e) {
    console.log("POST failed", e);
  }
});

socket.on("log.new", (log) => {
  console.log("📡 Received log:", log);
});

socket.on("incident.new", (incident) => {
  console.log("🚨 Received incident:", incident.title);
  process.exit(0);
});

setTimeout(() => {
  console.log("Timed out waiting for logs");
  process.exit(1);
}, 5000);
