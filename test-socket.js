const { io } = require("socket.io-client");

console.log("Connecting to http://localhost:3003...");
const socket = io("http://localhost:3003", {
  reconnectionDelayMax: 10000,
});

socket.on("connect", () => {
  console.log("✅ Successfully connected to Socket.IO! Socket ID:", socket.id);
  process.exit(0);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection Error:", err.message);
  process.exit(1);
});

// Timeout after 5 seconds if no connection
setTimeout(() => {
  console.error("❌ Timed out waiting for connection.");
  process.exit(1);
}, 5000);
