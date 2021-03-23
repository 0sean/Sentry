import { Request, Response } from "express";
import { DiscordClient } from "../../Bot";
import { getHighest } from "../../Permissions";

export const get = {
    name: "settings",
    method: "GET",
    callback: async (req: Request, res: Response) => {
        const user = req.user as Record<string, string>;
        if(!req.query.guildID) {
            res.status(400);
            return res.send({error: "No guildID given."});
        } else if(!DiscordClient?.guilds.cache.find(g => g.id == req.query.guildID)) {
            res.status(400);
            return res.send({error: "Invalid guildID given."});
        } else if(getHighest(user.id, req.query.guildID as string).level < 2) {
            res.status(403);
            return res.send({error: "Forbidden."});
        }
        const guild = DiscordClient.guilds.cache.get(req.query.guildID as string),
            moderatorRole = guild?.roles.cache.get(DiscordClient.provider.get(req.query.guildID as string, "moderatorRoleID")) || {id: "", name: ""},
            adminRole = guild?.roles.cache.get(DiscordClient.provider.get(req.query.guildID as string, "adminRoleID")) || {id: "", name: ""},
            verifyRole = guild?.roles.cache.get(DiscordClient.provider.get(req.query.guildID as string, "verifyRoleID")) || {id: "", name: ""},
            joinLeaveChannel = guild?.channels.cache.get(DiscordClient.provider.get(req.query.guildID as string, "joinLeaveChannelID")) || {id: "", name: ""},
            staffNotificationsChannel = guild?.channels.cache.get(DiscordClient.provider.get(req.query.guildID as string, "staffNotificationsChannelID")) || {id: "", name: ""},
            blockedTerms = DiscordClient.provider.get(req.query.guildID as string, "blockedTerms") as string[] || [];
        res.send({
            moderatorRole: {value: moderatorRole.id, label: moderatorRole.name},
            adminRole: {value: adminRole.id, label: adminRole.name},
            verifyEnabled: DiscordClient.provider.get(req.query.guildID as string, "verifyEnabled") || false,
            verifyRole: {value: verifyRole.id, label: verifyRole.name},
            spamFilterEnabled: DiscordClient.provider.get(req.query.guildID as string, "spamFilterEnabled") || false,
            blockedTermsEnabled: DiscordClient.provider.get(req.query.guildID as string, "blockedTermsEnabled") || false,
            blockedTerms: blockedTerms.map(t => { return {value: t, label: t}; }),
            joinLeaveEnabled: DiscordClient.provider.get(req.query.guildID as string, "joinLeaveEnabled") || false,
            joinLeaveChannel: {value: joinLeaveChannel.id, label: joinLeaveChannel.name},
            staffNotificationsEnabled: DiscordClient.provider.get(req.query.guildID as string, "staffNotificationsEnabled") || false,
            staffNotificationsChannel: {value: staffNotificationsChannel.id, label: staffNotificationsChannel.name},
            allRoles: DiscordClient.guilds.cache.get(req.query.guildID as string)?.roles.cache.filter(r => r.position != 0).map(r => { return {value: r.id, label: r.name}; }),
            allChannels: DiscordClient.guilds.cache.get(req.query.guildID as string)?.channels.cache.filter(c => c.type == "text").map(c => { return {value: c.id, label: `#${c.name}`}; })
        });
    }
};

export const post = {
    name: "settings",
    method: "POST",
    callback: async (req: Request, res: Response) => {
        const user = req.user as Record<string, string>;
        if(!req.body.guildID) {
            res.status(400);
            return res.send({error: "No guildID given."});
        } else if(!DiscordClient?.guilds.cache.get(req.body.guildID)) {
            res.status(400);
            return res.send({error: "Invalid guildID given."});
        } else if(getHighest(user.id, req.body.guildID as string).level < 2) {
            res.status(403);
            return res.send({error: "Forbidden."});
        }
        
        if(req.body.moderatorRole != undefined) {
            if(req.body.moderatorRole != null && !DiscordClient.guilds.cache.get(req.body.guildID)?.roles.cache.get(req.body.moderatorRole.value)) {
                res.status(400);
                return res.send({error: "Invalid moderatorRole."});
            }
            DiscordClient.provider.set(req.body.guildID, "moderatorRoleID", req.body.moderatorRole.value || null);
        } 
        if(req.body.adminRole != undefined) {
            if(req.body.adminRole != null && !DiscordClient.guilds.cache.get(req.body.guildID)?.roles.cache.get(req.body.adminRole.value)) {
                res.status(400);
                return res.send({error: "Invalid adminRole."});
            }
            if(getHighest(user.id, req.body.guildID as string).level != 3) {
                res.status(403);
                return res.send({error: "Forbidden."});
            }
            DiscordClient.provider.set(req.body.guildID, "adminRoleID", req.body.adminRole.value || null);
        } 
        if(req.body.verifyRole != undefined) {
            if(req.body.verifyRole != null && !DiscordClient.guilds.cache.get(req.body.guildID)?.roles.cache.get(req.body.verifyRole.value)) {
                res.status(400);
                return res.send({error: "Invalid verifyRole."});
            }
            DiscordClient.provider.set(req.body.guildID, "verifyRoleID", req.body.verifyRole.value || null);
        } 
        if(req.body.verifyEnabled != undefined) {
            DiscordClient.provider.set(req.body.guildID, "verifyEnabled", req.body.verifyEnabled);
        }

        // spamFilterEnabled,blockedTermsEnabled,joinLeaveEnabled,staffNotificationsEnabled: bool
        // blockedTerms: [{label,value}]
        // joinLeaveChannel, staffNotificationsChannel: {value: id}

        if(req.body.spamFilterEnabled != undefined) {
            DiscordClient.provider.set(req.body.guildID, "spamFilterEnabled", req.body.spamFilterEnabled);
        }
        if(req.body.blockedTermsEnabled != undefined) {
            DiscordClient.provider.set(req.body.guildID, "blockedTermsEnabled", req.body.blockedTermsEnabled);
        }
        if(req.body.joinLeaveEnabled != undefined) {
            DiscordClient.provider.set(req.body.guildID, "joinLeaveEnabled", req.body.joinLeaveEnabled);
        }
        if(req.body.staffNotificationsEnabled != undefined) {
            DiscordClient.provider.set(req.body.guildID, "staffNotificationsEnabled", req.body.staffNotificationsEnabled);
        }
        if(req.body.blockedTerms != undefined) {
            if(typeof req.body.blockedTerms != "object") {
                res.status(400);
                return res.send({error: "Invalid blockedTerms"});
            }
            DiscordClient.provider.set(req.body.guildID, "blockedTerms", (req.body.blockedTerms as {value: string}[]).map(v => v.value));
        }
        if(req.body.joinLeaveChannel != undefined) {
            if(req.body.joinLeaveChannel != null && !DiscordClient.guilds.cache.get(req.body.guildID)?.channels.cache.get(req.body.joinLeaveChannel.value)) {
                res.status(400);
                return res.send({error: "Invalid joinLeaveChannel."});
            }
            DiscordClient.provider.set(req.body.guildID, "joinLeaveChannelID", req.body.joinLeaveChannel.value || null);
        }
        if(req.body.staffNotificationsChannel != undefined) {
            if(req.body.staffNotificationsChannel != null && !DiscordClient.guilds.cache.get(req.body.guildID)?.channels.cache.get(req.body.staffNotificationsChannel.value)) {
                res.status(400);
                return res.send({error: "Invalid staffNotificationsChannel."});
            }
            DiscordClient.provider.set(req.body.guildID, "staffNotificationsChannelID", req.body.joinLeaveChannel.value || null);
        }
        
        res.send({success: true});
    }
};