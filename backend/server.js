import express from 'express';
import data from './data.js';
import path from 'path';
const app = express();

const port = process.env.PORT || 5000;

app.get('/api/products', (req, res) => {
  res.send(data.products);
});
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, '/frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, '/frontend/build/indexedDB.html'));
});
app.listen(port, () => {
  console.log(`Server listing on port:${port}`);
});
