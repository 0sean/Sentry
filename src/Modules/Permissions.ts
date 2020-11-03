import { Context } from "detritus-client/lib/command";
export interface PermissionSet {
    prettyName: string
    level: number
    identify(ctx: Context): boolean
    identifyAsync?(ctx: Context): Promise<boolean>
}

export const PS_BotOwner: PermissionSet = {
    prettyName: "Bot owner",
    level: 4,
    identify(ctx: Context): boolean {
        if(ctx.member?.isClientOwner) return true;
        return false;
    }
};

export const PS_GuildOwner: PermissionSet = {
    prettyName: "Guild owner",
    level: 3,
    identify(ctx: Context): boolean {
        if(ctx.member?.isOwner) return true;
        return false;
    }
};

export const PS_GuildMod: PermissionSet = {
    prettyName: "Guild moderator",
    level: 1,

    identify(ctx: Context): boolean {
        if(ctx.member?.isOwner) return true;
        // db check
        return false;
    }
};

// PermissionSets should be added to this array, or they will not work with identifyUser.
const PermissionSets: Array<PermissionSet> = [PS_BotOwner, PS_GuildMod, PS_GuildOwner];

export function identifyMember(ctx: Context): PermissionSet | undefined {
    PermissionSets.sort((a, b) => {
        return b.level - a.level;
    });

    for (let x = 0; x < PermissionSets.length; x++) {
        if (PermissionSets[x].identify(ctx)) return PermissionSets[x];
    }
    return undefined;
}