import { SuccessEmbed, InProgressEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { PS_GuildMod } from "../Permissions";
const base = new CommandBase();

base.name = "delpunishment";
base.description = "Deletes punishments.";
base.permissions = PS_GuildMod;
base.aliases = ["delpunish", "rmpunish", "rmpunishment", "delpunishments", "rmpunishments"];

base.contentArgs = [
    {name: "id", type: "string"}
];

base.run = async (ctx, args) => {
    const ids = (args.id as string)?.split(" ");
    if(!ids) {
        ctx.reply(ErrorEmbed("No punishments IDs were given."));
    } else if(ids.length == 1) {
        const document = await ctx.commandClient.db.collection("punishments").findOneAndDelete({
            guildId: ctx.guildId,
            punishId: ids[0]
        });

        if(document.value == null) {
            ctx.reply(ErrorEmbed("Could not find a punishment in this guild with that ID."));
        } else {
            ctx.reply(SuccessEmbed("✅ Punishment deleted"));
        }
    } else {
        const message = await ctx.reply(InProgressEmbed("🔁 Deleting punishments"));
        // eslint-disable-next-line no-var
        var statuses: boolean[] = [],
            errors = 0;
        for (const i in ids) {
            const document = await ctx.commandClient.db.collection("punishments").findOneAndDelete({
                guildId: ctx.guildId,
                punishId: ids[i]
            });
            
            if(document.value == null) {
                errors = 1;
                statuses[i] = false;
            } else {
                statuses[i] = true;
            }
        }
        if(errors == 0) {
            message.edit(SuccessEmbed(`✅ Deleted ${ids.length} punishments successfully`));
        } else {
            const description = statuses.map((s, i) => { return s ? `\`${ids[i]}\`: Deleted sucessfully.` : `\`${ids[i]}\`: Punishment not found.`; });
            message.edit(InProgressEmbed("⚠️ Finished with errors", description.join("\n")));
        }
    } 
};

export default base.command;