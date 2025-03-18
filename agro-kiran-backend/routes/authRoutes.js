import express from 'express';
import validateRequest, { schemas } from '../middleware/validateRequest.js';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', validateRequest(schemas.signup), signup);
router.post('/login', validateRequest(schemas.login), login);

export default router; 