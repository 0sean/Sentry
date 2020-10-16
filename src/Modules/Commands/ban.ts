import { Context } from "../Client";
import { ErrorEmbed, SuccessEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";
import { PS_GuildMod } from "../Permissions";
import random from "crypto-random-string";
import { ParsedArgs } from "detritus-client/lib/command";

export const command = {
    name: "ban",
    metadata: {
        description: "Bans users in the server.",
        permissions: PS_GuildMod
    },
    args: [{
        name: "purge",
        aliases: ["p"],
        metadata: {
            description: "How long to purge messages for from that user."
        },
        default: 0,
        type: Number
    }],
    onBefore: PS_GuildMod.identify,
    onRunError: UnexpectedError,
    run: async (ctx: Context, args: ParsedArgs): Promise<void> => {
        const commandArgs = args.ban.split(" "), reason = commandArgs.slice(1).join(" "), id = random({length: 7});
        if(!commandArgs) {
            ctx.reply(ErrorEmbed("No mention/ID was given."));
        } else {
            if(commandArgs[0].startsWith("<@!")) {
                const user = ctx.message.mentions.first();
                (await user?.createOrGetDm())?.createMessage(SuccessEmbed(`🔨 You were banned in ${ctx.guild?.name} for \`${reason}\`.`));
                ctx.guild?.createBan(user?.id as string, {
                    reason: `Banned by ${ctx.member?.username}#${ctx.member?.discriminator} for "${reason || "No reason"}". Punishment ID ${id}`,
                    deleteMessageDays: args.purge
                });
                ctx.commandClient.db.collection("punishments").insertOne({
                    punishId: id,
                    guildId: ctx.guildId,
                    reason,
                    type: "ban",
                    automated: false,
                    subjectId: user?.id,
                    actorId: ctx.member?.id
                });
                ctx.reply(SuccessEmbed(`✅ Banned ${user?.username}`));
            } else if(!isNaN(commandArgs[0])) {
                ctx.guild?.createBan(commandArgs[0], {
                    reason: `Banned by ${ctx.member?.username}#${ctx.member?.discriminator} for "${reason || "No reason"}". Punishment ID ${id}`,
                    deleteMessageDays: args.purge
                });
                ctx.commandClient.db.collection("punishments").insertOne({
                    punishId: id,
                    guildId: ctx.guildId,
                    reason,
                    type: "ban",
                    automated: false,
                    subjectId: commandArgs[0],
                    actorId: ctx.member?.id
                });
                ctx.reply(SuccessEmbed(`✅ Banned ID ${commandArgs[0]}`));
            } else {
                ctx.reply(ErrorEmbed("No mention/ID was given."));
            }
        }
    }
};

export default command;