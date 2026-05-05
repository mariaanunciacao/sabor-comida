import { Router } from 'express';
import { listarCategorias, search } from '../controllers/searchController.js';

const router = Router();

router.get('/categorias', listarCategorias);
router.get('/search', search);

export default router;