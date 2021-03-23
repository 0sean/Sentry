import { Router } from "express";
import { DiscordClient } from "../../Bot";

const router = Router();

router.get("/commands", async (req, res) => {
    const commands = DiscordClient?.registry.commands.map(c => { return {name: c.name, aliases: c.aliases, description: c.description, format: c.format}; });
    res.send({commands, prefix: process.env.PREFIX});
});

export default router;