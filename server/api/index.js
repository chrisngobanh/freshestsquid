import express from 'express';

import userController from './user';
import loadoutController from './loadout';

const router = new express.Router();

router.use('/user', userController);
router.use('/loadout', loadoutController);

export default router;
