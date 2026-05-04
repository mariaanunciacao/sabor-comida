import { Router } from 'express';
import { redefinirSenha, solicitarRecuperacao } from '../controllers/passwordRecoveryController.js';

const router = Router();

router.post('/recuperar-senha', solicitarRecuperacao);
router.post('/redefinir-senha', redefinirSenha);

export default router;