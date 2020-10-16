import { ParsedArgs } from "detritus-client/lib/command";
import { Context } from "../Client";
import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";

export const command = {
    name: "punishment",
    metadata: {
        description: "Shows information about a punishment."
    },
    onRunError: UnexpectedError,
    run: async (ctx: Context, args: ParsedArgs): Promise<void> => {
        const document = await ctx.commandClient.db.collection("punishments").findOne({
            guildId: ctx.guildId,
            punishId: args.punishment
        });
        if(!document) {
            ctx.reply(ErrorEmbed("Punishment with that ID not found"));
        } else {
            const actor = ctx.guild?.members.find(m => m.id == document.actorId),
                subject = ctx.guild?.members.find(m => m.id == document.subjectId);
            ctx.reply(SuccessEmbed(`Subject: ${subject?.name}#${subject?.discriminator} | Reason: \`${document.reason}\``, `${document.automated ? "Automated punishment" : `Punished by ${actor?.name}#${actor?.discriminator}`}\nType: ${document.type}`));
        }
    }
};

export default command;