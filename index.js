const express = require("express");
const app = express();

app.use(express.json());

app.get("/webhook", (req, res) => {
  const verify_token = "jean_hubert_token"; // Ton token défini dans Meta

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === verify_token) {
    console.log("✅ Webhook vérifié !");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Webhook refusé");
    res.sendStatus(403);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Serveur Jean-Hubert bot lancé !");
});