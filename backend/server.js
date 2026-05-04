import dotenv from 'dotenv';
import app from './src/app.js';
import { initializeModels } from './src/models/index.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const PORT = Number(process.env.PORT ?? 3002);

await initializeModels();

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});