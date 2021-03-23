import { Router } from "express";
import { DiscordClient } from "../../Bot";

const router = Router();

router.get("/stats", async (req, res) => {
    const servers = DiscordClient?.guilds.cache.size, users = DiscordClient?.users.cache.filter(u => !u.bot).size;
    res.send({servers, users});
});

export default router;