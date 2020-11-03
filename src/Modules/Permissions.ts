import { Context } from "detritus-client/lib/command";
import { Member } from "detritus-client/lib/structures";
import { Context as ClientContext } from "./Client";
export interface PermissionSet {
    prettyName: string
    level: number
    identify(ctx: Context, member?: Member): Promise<boolean> | boolean
}

export const PS_BotOwner: PermissionSet = {
    prettyName: "Bot owner",
    level: 4,
    identify(ctx, member?): boolean {
        if(!member) member = ctx.member;
        if(member?.isClientOwner) return true;
        return false;
    }
};

export const PS_GuildOwner: PermissionSet = {
    prettyName: "Guild owner",
    level: 3,
    identify(ctx, member?): boolean {
        if(!member) member = ctx.member;
        if(member?.isOwner) return true;
        return false;
    }
};

export const PS_GuildMod: PermissionSet = {
    prettyName: "Guild moderator",
    level: 1,

    async identify(ctx, member?): Promise<boolean> {
        if(!member) member = ctx.member;
        if(ctx.member?.isOwner) return true;
        const document = await (ctx as ClientContext).commandClient.db.collection("guildSettings").findOne({
            guildId: ctx.guildId
        });
        if(!document) return false;
        if(!ctx.member?.roles.find(r => r?.id == document.modRole)) return false;
        return true;
    }
};

// PermissionSets should be added to this array, or they will not work with identifyUser.
const PermissionSets: Array<PermissionSet> = [PS_BotOwner, PS_GuildMod, PS_GuildOwner];

export function identifyMember(ctx: Context, member?: Member): PermissionSet | undefined {
    if(!member) member = ctx.member;
    PermissionSets.sort((a, b) => {
        return b.level - a.level;
    });

    for (let x = 0; x < PermissionSets.length; x++) {
        if (PermissionSets[x].identify(ctx, member)) return PermissionSets[x];
    }
    return undefined;
}