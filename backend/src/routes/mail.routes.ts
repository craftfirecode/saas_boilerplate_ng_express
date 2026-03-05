import { Router } from 'express';
import { sendTestMail } from '../controllers/mail.controller.js';
import { verifyAccess } from '../middleware/verifyAccessToken.js';

const router = Router();

router.use(verifyAccess);
router.get('/test', sendTestMail);

export default router;
