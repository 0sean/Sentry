import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { PS_GuildMod } from "../Permissions";
import { Message } from "detritus-client/lib/structures";
const base = new CommandBase();

base.name = "newnote";
base.description = "Creates a note. Also accepts a forwarded message as content.";
base.permissions = PS_GuildMod;
base.aliases = ["addnote"];

base.contentArgs = [
    {name: "name", type: "string"},
    {name: "content", type: "string"}
];

base.run = async (ctx, args) => {
    let message: Message;
    const noteContent = {
        text: "",
        imageUrl: ""
    };
    if(!args.name) return ctx.reply(ErrorEmbed("No name was given."));
    if(!args.content && !ctx.message.attachments.first()) {
        const refId = ctx.message.messageReference?.messageId;
        if(refId) {
            message = await ctx.channel?.fetchMessage(refId);
        } else {
            return ctx.reply(ErrorEmbed("No content was given."));
        }
    } else {
        message = ctx.message;
    }
    message.attachments.forEach(a => {
        if(a.isImage && !noteContent.imageUrl) {
            noteContent.imageUrl = a.url || "";
        }
    });
    noteContent.text = args.content as string || message.content;

    ctx.commandClient.db.collection("notes").insertOne({
        guildId: ctx.guildId,
        creatorId: ctx.member?.id,
        noteName: args.name,
        noteContent
    });

    ctx.reply(SuccessEmbed("✅ Note created.", `View it using \`${ctx.prefix}note ${args.name}\``));
};

export default base.command;