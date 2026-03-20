import { Router, Request, Response } from 'express';
import clanRoutes from './clan.routes';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/clan', clanRoutes);

export default router;
