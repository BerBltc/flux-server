const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.type === 'auth') {
      ws.userId = msg.userId;
      clients.set(msg.userId, ws);
      return;
    }

    if (!ws.userId) return;

    const sendTo = clients.get(msg.to);
    if (sendTo) {
      sendTo.send(JSON.stringify({
        type: msg.type,
        from: ws.userId,
        payload: msg.payload || {}
      }));
    }
  });

  ws.on('close', () => {
    if (ws.userId) clients.delete(ws.userId);
  });
});

app.get('/', (_, res) => res.send('Flux server aktif'));

const PORT = process.env.PORT || 3000;
server.listen(PORT);
