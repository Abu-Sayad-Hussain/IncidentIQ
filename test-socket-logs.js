const { io } = require("socket.io-client");

const socket = io("http://localhost:3003", {
  reconnectionDelayMax: 10000,
});

socket.on("connect", () => {
  console.log("✅ Successfully connected! Socket ID:", socket.id);
});

socket.on("log.new", (log) => {
  console.log("📡 Received log:", log.level, log.serviceName);
});

socket.on("incident.new", (incident) => {
  console.log("🚨 Received incident:", incident.title);
});

setTimeout(() => {
  console.log("Done listening.");
  process.exit(0);
}, 10000);
