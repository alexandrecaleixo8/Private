require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || './dados';
const TOKEN = process.env.TOKEN || 'segredo';

fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '100mb' }));

// Auth por token (exceto painel)
app.use((req, res, next) => {
  if (req.path.startsWith('/painel') || req.path === '/') return next();
  const token = (req.headers['authorization'] || '').replace('Bearer ', '').trim();
  if (token !== TOKEN) return res.status(401).json({ error: 'token inválido' });
  next();
});

// Upload de arquivos (fotos, vídeos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const device = (req.headers['x-device-id'] || 'device').replace(/\W/g, '');
    const hoje = new Date().toISOString().slice(0, 10);
    const tipo = (req.headers['x-tipo'] || 'arquivos').replace(/\W/g, '');
    const dir = path.join(DATA_DIR, device, hoje, tipo);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname.replace(/[^\w.\-]/g, '_'));
  }
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

app.post('/upload', upload.array('files', 200), (req, res) => {
  res.json({ ok: true, recebidos: req.files.length });
});

// Metadados (contatos, info do device, EXIF)
app.post('/meta', (req, res) => {
  const device = (req.headers['x-device-id'] || 'device').replace(/\W/g, '');
  const hoje = new Date().toISOString().slice(0, 10);
  const dir = path.join(DATA_DIR, device, hoje);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `meta_${Date.now()}.json`), JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
});

// Lista devices e arquivos pro painel
app.get('/api/list', (req, res) => {
  const devices = fs.existsSync(DATA_DIR) ? fs.readdirSync(DATA_DIR) : [];
  const out = {};
  for (const dev of devices) {
    const devPath = path.join(DATA_DIR, dev);
    out[dev] = {};
    for (const dia of fs.readdirSync(devPath)) {
      const diaPath = path.join(devPath, dia);
      out[dev][dia] = {};
      for (const tipo of fs.readdirSync(diaPath)) {
        const tipoPath = path.join(diaPath, tipo);
        out[dev][dia][tipo] = fs.readdirSync(tipoPath);
      }
    }
  }
  res.json(out);
});

// Serve arquivos enviados (pra ver no painel)
app.use('/files', express.static(DATA_DIR));
app.use('/painel', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.redirect('/painel/painel.html'));

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));