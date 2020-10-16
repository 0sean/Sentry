import { Context } from "../Client";
import { ErrorEmbed, SuccessEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";
import { PS_GuildMod } from "../Permissions";
import random from "crypto-random-string";
import { ParsedArgs } from "detritus-client/lib/command";

export const command = {
    name: "strike",
    metadata: {
        description: "Strikes users in the server.",
        permissions: PS_GuildMod
    },
    onBefore: PS_GuildMod.identify,
    onRunError: UnexpectedError,
    run: async (ctx: Context, args: ParsedArgs): Promise<void> => {
        console.log(args);
        const commandArgs = args.strike.split(" "), reason = commandArgs.slice(1).join(" "), id = random({length: 7});
        if(!commandArgs[0]) {
            ctx.reply(ErrorEmbed("No mention/ID was given."));
        } else {
            if(ctx.message.mentions.first()) {
                const user = ctx.message.mentions.first();
                ctx.commandClient.db.collection("punishments").insertOne({
                    punishId: id,
                    guildId: ctx.guildId,
                    reason,
                    type: "strike",
                    automated: false,
                    subjectId: user?.id,
                    actorId: ctx.member?.id
                });
                (await user?.createOrGetDm())?.createMessage(SuccessEmbed(`🔨 You were striked in ${ctx.guild?.name} for \`${reason}\`.`));
                ctx.reply(SuccessEmbed(`✅ Striked ${user?.username}`, `Punishment ID \`${id}\``));
            } else {
                ctx.reply(ErrorEmbed("No valid mention was given."));
            }
        }
    }
};

export default command;