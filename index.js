const express = require('express');
const app = express();

app.use(express.json());

// ✅ Route GET : validation du webhook par Meta
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "jean_hubert_token";

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log("✅ Webhook validé avec succès !");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ Échec de validation du webhook.");
    res.sendStatus(403);
  }
});

// ✅ Route POST : ici tu traiteras les messages entrants plus tard
app.post('/webhook', (req, res) => {
  console.log("📩 Message reçu :", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// ✅ Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(🚀 Serveur lancé sur le port ${PORT});
});