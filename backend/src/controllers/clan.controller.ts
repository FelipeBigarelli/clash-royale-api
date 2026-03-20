import { Request, Response, NextFunction } from 'express';
import { clanService } from '../services/clan.service';

export const clanController = {
  async overview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clanService.getClanData();
      res.json({ success: true, data: data.overview });
    } catch (err) {
      next(err);
    }
  },

  async members(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clanService.getClanData();
      res.json({ success: true, data: data.members, total: data.members.length });
    } catch (err) {
      next(err);
    }
  },

  async ranking(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clanService.getClanData();
      res.json({ success: true, data: data.ranking, total: data.ranking.length });
    } catch (err) {
      next(err);
    }
  },

  async inactive(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clanService.getClanData();
      res.json({ success: true, data: data.inactive, total: data.inactive.length });
    } catch (err) {
      next(err);
    }
  },

  async memberByTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { tag } = req.params;
      const member = await clanService.getMemberByTag(tag);
      if (!member) {
        res.status(404).json({ success: false, error: 'Member not found in clan' });
        return;
      }
      res.json({ success: true, data: member });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      clanService.invalidateCache();
      const data = await clanService.getClanData(true);
      res.json({ success: true, data: data.overview, message: 'Data refreshed' });
    } catch (err) {
      next(err);
    }
  },
};
