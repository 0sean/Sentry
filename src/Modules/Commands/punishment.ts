import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
const base = new CommandBase();

base.name = "punishment";
base.description = "Shows punishment details.";

base.contentArgs = [
    {name: "id", type: "string"}
];

base.run = async (ctx, args) => {
    if(!args.id) return ctx.reply(ErrorEmbed("Punishment ID required."));
    const document = await ctx.commandClient.db.collection("punishments").findOne({
        guildId: ctx.guildId,
        punishId: args.id
    });
    if(!document) return ctx.reply(ErrorEmbed("No punishment found with that ID."));
    const actor = ctx.guild?.members.find(m => m.id == document.actorId),
        subject = ctx.guild?.members.find(m => m.id == document.subjectId),
        a = actor ? `\`${actor.username}#${actor.discriminator}\`` : `ID \`${document.actorId}\``,
        s = subject ? `\`${subject.username}#${subject.discriminator}\`` : `ID \`${document.subjectId}\``;
    ctx.reply(SuccessEmbed(`🔨 ID ${args.id}`, `Type: \`${document.type}\``, [{name: "Subject:", value: s}, {name: "Punished by:", value: document.automated ? `${ctx.me?.username} (automated punishment)` : a}, {name: "Reason:", value: `\`${document.reason}\``}]));
};

export default base.command;