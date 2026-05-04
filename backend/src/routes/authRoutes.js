import { Router } from 'express';
import { login, me, register } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/auth/login', login);
router.post('/auth/register', register);
router.get('/auth/me', authenticateToken, me);

export default router;
