import { ParsedArgs } from "detritus-client/lib/command";
import { Context } from "../Client";
import { SuccessEmbed, ErrorEmbed, InProgressEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";

export const command = {
    name: "delpunishment",
    metadata: {
        description: "Deletes punishments."
    },
    aliases: ["delpunish", "rmpunishment", "rmpunish", "delpunishments", "rmpunishments"],
    onRunError: UnexpectedError,
    run: async (ctx: Context, args: ParsedArgs): Promise<void> => {
        const commandArgs = (Object.values(args)[0] as string).split(" ");
        if(commandArgs.length == 0) {
            ctx.reply(ErrorEmbed("You didn't give any punishments to delete."));
        } else {
            const document = await ctx.commandClient.db.collection("punishments").findOneAndDelete({
                guildId: ctx.guildId,
                punishId: commandArgs[0]
            });

            if(document.value == null) {
                ctx.reply(ErrorEmbed("No punishment found in this guild with that ID."));
            } else {
                ctx.reply(SuccessEmbed("✅ Punishment deleted."));
            }
        }
    }
};

export default command;