const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

const qcm = require("./qcm.json").questions;

async function sendMessage(to, message) {
  await axios.post(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: message }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
}

app.post("/webhook", async (req, res) => {
  const body = req.body;
  if (body.entry && body.entry[0].changes) {
    const message = body.entry[0].changes[0].value.messages?.[0];
    const from = message.from;
    const text = message.text?.body?.trim();

    if (text === "DÉMARRER") {
      const q = qcm[0];
      await sendMessage(from, `Bienvenue dans la formation Jean Hubert 🤠\n\n*Question ${q.id}* : ${q.question}\nA) ${q.options.A}\nB) ${q.options.B}\nC) ${q.options.C}\nD) ${q.options.D}`);
    }
    if (["A", "B", "C", "D"].includes(text)) {
      const q = qcm[0];
      if (text === q.answer) {
        await sendMessage(from, `✅ Bonne réponse !\n${q.explanation}`);
      } else {
        await sendMessage(from, `❌ Mauvaise réponse !\n${q.explanation}`);
      }
    }
  }

  res.sendStatus(200);
});

app.get("/webhook", (req, res) => {
  const verify_token = "jean-hubert-secret";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Jean Hubert écoute sur le port ${PORT}`);
});
