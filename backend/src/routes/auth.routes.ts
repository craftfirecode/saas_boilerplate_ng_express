import { Router } from 'express';
import { login, refresh, logout, me, register, verifyEmail } from '../controllers/auth.controller.js';
import { verifyAccess } from '../middleware/verifyAccessToken.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', verifyAccess, me);
router.get('/verify-email', verifyEmail);

export default router;
