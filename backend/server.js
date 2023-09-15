import express from 'express';
import data from './data.js';
import path from 'path';
import multer from 'multer';
import { uploadProductImageTowebDav } from './webdav/webdavServer.js';

const app = express();
const upload = multer();
const port = process.env.PORT || 5000;
app.use('/uploads', express.static('uploads'));
app.get('/api/products', (req, res) => {
  res.send(data.products);
});
app.get('/api/products', (req, res) => {
  res.send(data.products);
});
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const fileLocation = await uploadProductImageTowebDav(req.file);
  if (fileLocation) {
    res.status(200).json({ 'File Uploaded': fileLocation });
  } else {
    res.send('Image upload Error');
  }
});

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, '/frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, '/frontend/build/indexedDB.html'));
});
app.listen(port, () => {
  console.log(`Server listing on port:${port}`);
});
