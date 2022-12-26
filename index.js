const express = require('express');
const app = express();

const PORT = 3000;

app.get('/test', (req, res) => {
  res.json({status: 200, message: 'ok'});
});

app.get('/time', (req, res) => {
  const currentTime = new Date().toLocaleTimeString();
  res.json({status: 200, message: currentTime});
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});