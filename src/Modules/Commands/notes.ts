import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
const base = new CommandBase();

base.name = "notes";
base.description = "Shows a note.";
base.aliases = ["n"];

base.contentArgs = [
    {name: "note", type: "string"}
];

base.run = async (ctx, args) => {
    ctx.reply(SuccessEmbed(args.note as string, "This is a very cool note. ```You can even have code.```", undefined, "Note created by Anidox#6280."));
};

export default base.command;
