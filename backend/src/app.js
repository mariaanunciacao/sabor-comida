import express from 'express';
import cors from 'cors';
import searchRoutes from './routes/searchRoutes.js';
import passwordRecoveryRoutes from './routes/passwordRecoveryRoutes.js';
import commerceRoutes from './routes/commerceRoutes.js';
import restauranteRoutes from './routes/restauranteRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import pagamentosRoutes from './routes/pagamentosRoutes.js';
import restaurantePedidosRoutes from './routes/restaurantePedidosRoutes.js';
import restauranteConfigRoutes from './routes/restauranteConfigRoutes.js';
import restauranteMenuRoutes from './routes/restauranteMenuRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', searchRoutes);
app.use('/api', authRoutes);
app.use('/api', passwordRecoveryRoutes);
app.use('/api', commerceRoutes);
app.use('/api', restauranteRoutes);
app.use('/api', adminRoutes);
app.use('/api', pagamentosRoutes);
app.use('/api', restaurantePedidosRoutes);
app.use('/api', restauranteConfigRoutes);
app.use('/api', restauranteMenuRoutes);

app.get('/', (req, res) => {
  res.send('API Sabor Comida funcionando 🍔');
});

export default app;