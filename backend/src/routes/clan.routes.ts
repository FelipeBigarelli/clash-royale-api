import { Router } from 'express';
import { clanController } from '../controllers/clan.controller';

const router = Router();

router.get('/overview', clanController.overview);
router.get('/members', clanController.members);
router.get('/ranking', clanController.ranking);
router.get('/inactive', clanController.inactive);
router.post('/refresh', clanController.refresh);
router.get('/member/:tag', clanController.memberByTag);

export default router;
