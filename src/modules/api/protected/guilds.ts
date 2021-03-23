import { Request, Response } from "express";
import { DiscordClient } from "../../Bot";
import { getHighest } from "../../Permissions";

export default {
    name: "guilds",
    method: "GET",
    callback: async (req: Request, res: Response) => {
        const user = req.user as Record<string, unknown>,
            guilds = DiscordClient?.guilds.cache.filter(g => {
                if(g.member(user.id as string)) {
                    return getHighest(user.id as string, g.id).level > 1;
                } else { return false; }
            }).map(g => { return {value: g.id, label: g.name}; });
        res.send({guilds});
    }
};