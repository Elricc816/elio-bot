const { Connectors } = require("shoukaku");

// Lavalink nodes (Render / hosted Lavalink)
const nodes = [
  {
    name: "main",
    url: "ws://lavalink-latest-bcvc.onrender.com:2333",
    auth: "youshallnotpass",
    secure: false
  }
];

module.exports = { nodes };
