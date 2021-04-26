import { DiscordClient } from "./Bot";

class PermissionGroup {
    constructor(prettyName: string, level: number, identify: (userID?: string, guildID?: string) => boolean) {
        this.prettyName = prettyName;
        this.level = level;
        this.identify = identify;
    }

    prettyName: string
    level: number
    identify: (userID?: string, guildID?: string) => boolean
}

export const MemberGroup = new PermissionGroup("Member", 0, () => true);
export const ModeratorGroup = new PermissionGroup("Moderator", 1, (userID, guildID) => {
    return DiscordClient?.guilds.cache.get(guildID || "")?.members.cache.get(userID || "")?.roles.cache.has(DiscordClient.provider.get(guildID || "", "moderatorRoleID")) || false;
});
export const AdminGroup = new PermissionGroup("Admin", 2, (userID, guildID) => {
    return DiscordClient?.guilds.cache.get(guildID || "")?.members.cache.get(userID || "")?.roles.cache.has(DiscordClient.provider.get(guildID || "", "adminRoleID")) || false;
});
export const GuildOwnerGroup = new PermissionGroup("Server Owner", 3, (userID, guildID) => {
    return DiscordClient?.guilds.cache.get(guildID || "")?.ownerID == userID;
});

const AllGroups = [MemberGroup, ModeratorGroup, AdminGroup, GuildOwnerGroup];

export function getHighest(userID: string, guildID: string) {
    let highest = MemberGroup;
    AllGroups.forEach(group => {
        const result = group.identify(userID, guildID);
        if(result) highest = group;
    });
    return highest;
}