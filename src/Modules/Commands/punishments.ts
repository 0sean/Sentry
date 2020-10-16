import { Context } from "../Client";
import { ErrorEmbed, SuccessEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";
import { PS_GuildMod } from "../Permissions";
import { ParsedArgs } from "detritus-client/lib/command";

const ifAutomated = (d: Record<string, unknown>, ctx: Context): string => {
    if(d.automated) {
        return "Automated punishment";
    } else {
        const actor = ctx.guild?.members.find(m => m.id == d.actorId);
        return `Punished by ${actor?.name}#${actor?.discriminator}`;
    }
};

const ofType = (type: string): string => {
    if(type == "all") {
        return "";
    } else {
        return ` of type ${type}`;
    }
};

export const command = {
    name: "punishments",
    metadata: {
        description: "Check's a user's punishments in the server.",
        permissions: PS_GuildMod
    },
    args: [{
        name: "type",
        default: "all",
        metadata: {
            description: "Filters the type of punishment.",
            allowed_values: ["all", "strike", "ban", "kick", "mute"]
        },
        type: String
    }],
    onBefore: PS_GuildMod.identify,
    onRunError: UnexpectedError,
    run: async (ctx: Context, args: ParsedArgs): Promise<void> => {
        const commandArgs = args.punishments, member = ctx.message.mentions.first();
        if(!member && isNaN(commandArgs)) {
            ctx.reply(ErrorEmbed("No valid mention or ID given"));
        } else if(member) {
            const find = await ctx.commandClient.db.collection("punishments").find({
                guildId: ctx.guildId,
                subjectId: member.id
            });
            let arr = await find.toArray();
            switch(args.type) {
            case "strike":
                arr = arr.filter(d => d.type == "strike");
                break;
            case "ban":
                arr = arr.filter(d => d.type == "ban");
                break;
            case "kick":
                arr = arr.filter(d => d.type == "kick");
                break;
            case "mute":
                arr = arr.filter(d => d.type == "mute");
                break;
            }
            const fields = arr.map(d => { return {name: `ID \`${d.punishId}\` | Reason: \`${d.reason}\``, value: `${ifAutomated(d, ctx)}\nType: ${d.type}`}; });
            await find.close();

            
            if(!fields[0]) {
                ctx.reply(SuccessEmbed(`🎉 ${member.name} has no punishments!`));
            } else {
                ctx.reply(SuccessEmbed(`🛠️ ${member.name}'s punishments`, `They have ${fields.length} punishment(s).`, fields));
            }
        } else if(!isNaN(commandArgs)) {
            const find = await ctx.commandClient.db.collection("punishments").find({
                    guildId: ctx.guildId,
                    subjectId: commandArgs,
                }), fields = (await find.toArray()).map(d => { return { name: `ID \`${d.punishId}\` | Reason: \`${d.reason}\``, value: `${ifAutomated(d, ctx)}\nType: ${d.type}` }; });
            await find.close();


            if (!fields[0]) {
                ctx.reply(SuccessEmbed(`🎉 ID ${commandArgs} has no punishments${ofType(args.type)}!`));
            } else {
                ctx.reply(SuccessEmbed(`🛠️ ID ${commandArgs}'s punishments${ofType(args.type)}`, `They have ${fields.length} punishment(s)${ofType(args.type)}.`, fields));
            }
        }
    }
};

export default command;