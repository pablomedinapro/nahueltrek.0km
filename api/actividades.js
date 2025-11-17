import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const actividadesPath = path.join(__dirname, '../data/actividades.json');

  try {
    if (req.method === 'GET') {
      // Leer actividades
      const data = fs.readFileSync(actividadesPath, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      // Guardar actividades
      const actividades = req.body;
      fs.writeFileSync(actividadesPath, JSON.stringify(actividades, null, 4));
      return res.status(200).json({ success: true, message: 'Actividades guardadas' });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en API actividades:', error);
    return res.status(500).json({ error: error.message });
  }
}
