import { Router, Request, Response } from "express";
import axios from "axios";
import clanRoutes from "./clan.routes";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/myip", async (_req, res) => {
  const { data } = await axios.get("https://api.ipify.org?format=json");
  res.json(data);
});

router.use("/clan", clanRoutes);

export default router;
