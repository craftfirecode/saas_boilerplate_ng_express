import { Router } from 'express';
import {
  updateProfile, updatePassword, requestEmailUpdate, confirmEmailUpdate,
  requestAccountDeletion, confirmAccountDeletion,
  requestPasswordResetHandler, confirmPasswordResetHandler,
} from '../controllers/user.controller.js';
import { verifyAccess } from '../middleware/verifyAccessToken.js';

const router = Router();

router.put('/me', verifyAccess, updateProfile);
router.put('/me/password', verifyAccess, updatePassword);
router.put('/me/email', verifyAccess, requestEmailUpdate);
router.get('/me/confirm-email', confirmEmailUpdate);
router.post('/me/request-delete', verifyAccess, requestAccountDeletion);
router.get('/me/confirm-delete', confirmAccountDeletion);
router.post('/forgot-password', requestPasswordResetHandler);
router.post('/reset-password', confirmPasswordResetHandler);

export default router;
