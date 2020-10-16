import { Context } from "../Client";
import { ErrorEmbed, SuccessEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";
import { PS_GuildMod } from "../Permissions";
import random from "crypto-random-string";
import { ParsedArgs } from "detritus-client/lib/command";

export const command = {
    name: "kick",
    metadata: {
        description: "Kicks users in the server.",
        permissions: PS_GuildMod
    },
    onBefore: PS_GuildMod.identify,
    onRunError: UnexpectedError,
    run: async (ctx: Context, args: ParsedArgs): Promise<void> => {
        const commandArgs = args.kick.split(" "), reason = commandArgs.slice(1).join(" ") || "No reason given", id = random({length: 7});
        console.log(reason);
        console.log(typeof reason);
        if(!commandArgs) {
            ctx.reply(ErrorEmbed("No mention/ID was given."));
        } else {
            if(commandArgs[0].startsWith("<@!")) {
                // TODO: Check user lvl is not same/lower
                const user = ctx.message.mentions.first();
                (await user?.createOrGetDm())?.createMessage(SuccessEmbed(`🔨 You were kicked in ${ctx.guild?.name} for \`${reason}\`.`));
                ctx.guild?.removeMember(user?.id as string, {
                    reason: `Kicked by ${ctx.member?.username}#${ctx.member?.discriminator} for "${reason}". Punishment ID ${id}`
                });
                ctx.commandClient.db.collection("punishments").insertOne({
                    punishId: id,
                    guildId: ctx.guildId,
                    reason,
                    type: "kick",
                    automated: false,
                    subjectId: user?.id,
                    actorId: ctx.member?.id
                });
                ctx.reply(SuccessEmbed(`✅ Kicked ${user?.username}`));
            } else {
                ctx.reply(ErrorEmbed("No mention was given."));
            }
        }
    }
};

export default command;