import express from 'express';
const router = express.Router();

import { signInController, signUpController } from '../controllers/userControllers.js';

router.post('/signin', signInController);
router.post('/signup', signUpController);

export default router;
