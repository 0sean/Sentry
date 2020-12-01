import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { PS_GuildMod } from "../Permissions";
const base = new CommandBase();

base.name = "delnote";
base.description = "Deletes a note.";
base.permissions = PS_GuildMod;
base.aliases = ["rmnote"];

base.contentArgs = [
    {name: "name", type: "string"}
];

base.run = async (ctx, args) => {
    if(!args.name) return ctx.reply(ErrorEmbed("No name was given."));

    const document = await ctx.commandClient.db.collection("notes").findOneAndDelete({
        guildId: ctx.guildId,
        noteName: args.name
    });

    if(document.value == null) return ctx.reply(ErrorEmbed("No note was found with that name."));
    ctx.reply(SuccessEmbed("✅ Note deleted."));
};

export default base.command;