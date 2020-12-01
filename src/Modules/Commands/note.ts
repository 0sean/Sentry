import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
const base = new CommandBase();

base.name = "note";
base.description = "Opens a note.";
base.aliases = ["n"];

base.contentArgs = [
    {name: "name", type: "string"}
];

base.run = async (ctx, args) => {
    if(!args.name) return ctx.reply(ErrorEmbed("No name specified."));
    
    const document = await ctx.commandClient.db.collection("notes").findOne({
        guildId: ctx.guildId,
        noteName: args.name
    });

    if(!document) return ctx.reply(ErrorEmbed("No note found with that name"));

    const creator = ctx.guild?.members.find(m => m.id == document.creatorId)
        , creatorStr = creator ? `${creator.username}#${creator.discriminator}` : `ID ${document.creatorId}`
        , embed = SuccessEmbed(`📝 Note \`${args.name}\``, document.noteContent.text, undefined, `Note created by ${creatorStr}`);

    if(document.noteContent.imageUrl) {
        embed.embed.setImage(document.noteContent.imageUrl);
    }

    ctx.reply(embed); 
};

export default base.command;