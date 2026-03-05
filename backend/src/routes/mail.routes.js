import { Router } from 'express';
import { sendTestMail } from '../controllers/mail.controller.js';
import { verifyAccess } from '../middleware/verifyAccessToken.js';

const router = Router();

// Alle Mail-Endpunkte erfordern einen gültigen JWT
router.use(verifyAccess);

// GET /mail/test – Versendet eine Test-E-Mail
router.get('/test', sendTestMail);

export default router;
