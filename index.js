const express = require('express');
const app = express();

app.use(express.json());

// ✅ Webhook de validation Meta
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "jean_hubert_token";

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log('✅ Webhook validé par Meta');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Serveur en ligne sur le port ' + PORT);
});