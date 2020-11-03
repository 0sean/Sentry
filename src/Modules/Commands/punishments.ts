import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { Member } from "detritus-client/lib/structures";
const base = new CommandBase();

base.name = "punishments";
base.description = "Lists a member's punishments in the server.";

base.contentArgs = [
    {name: "member", type: "member"}
];
base.args = [{
    name: "type",
    default: "all",
    aliases: ["t"],
    metadata: {
        description: "Filters punishments by type"
    },
    type: String
}];

base.run = async (ctx, args, parsedArgs) => {
    if(!args.member) return ctx.reply(ErrorEmbed("Member mention or ID required."));
    if(parsedArgs.type != "all" && parsedArgs.type != "strike" && parsedArgs.type != "ban" && parsedArgs.type != "kick" && parsedArgs.type != "mute") return ctx.reply(ErrorEmbed("Invalid type given.", "Valid types: `all, strike, ban, kick, mute`"));
    if(typeof args.member == "string") {
        if(isNaN(parseFloat(args.member))) return ctx.reply(ErrorEmbed("Invalid member ID."));
        const doc = await ctx.commandClient.db.collection("punishments").find({
            guildId: ctx.guildId,
            subjectId: args.member
        });
        let document = await doc.toArray();
        switch (args.type) {
        case "strike":
            document = document.filter(d => d.type == "strike");
            break;
        case "ban":
            document = document.filter(d => d.type == "ban");
            break;
        case "kick":
            document = document.filter(d => d.type == "kick");
            break;
        case "mute":
            document = document.filter(d => d.type == "mute");
            break;
        }
        const fields = document.map(p => { return {name: `ID \`${p.punishId}\``, value: `Type: ${p.type}\nReason: \`${p.reason}\``}; });
        await doc.close();

        if(!fields[0]) {
            ctx.reply(SuccessEmbed(`🎉 ID \`${args.member}\` has no punishments!`));
        } else {
            ctx.reply(SuccessEmbed(`🔨 ID \`${args.member}\`'s punishments.`, `They have ${fields.length} punishment(s).`, fields, `Use ${ctx.prefix}punishment to see more details of a punishment.`));
        }
    } else {
        const doc = await ctx.commandClient.db.collection("punishments").find({
                guildId: ctx.guildId,
                subjectId: args.member.id
            }), member = args.member as Member;
        let document = await doc.toArray();
        switch (args.type) {
        case "strike":
            document = document.filter(d => d.type == "strike");
            break;
        case "ban":
            document = document.filter(d => d.type == "ban");
            break;
        case "kick":
            document = document.filter(d => d.type == "kick");
            break;
        case "mute":
            document = document.filter(d => d.type == "mute");
            break;
        }
        const fields = document.map(p => { return {name: `ID \`${p.punishId}\``, value: `Type: ${p.type}\nReason: \`${p.reason}\``}; });
        await doc.close();

        if(!fields[0]) {
            ctx.reply(SuccessEmbed(`🎉 ${member.username}#${member.discriminator} has no punishments!`));
        } else {
            ctx.reply(SuccessEmbed(`🔨 ${member.username}#${member.discriminator}'s punishments.`, `They have ${fields.length} punishment(s).`, fields, `Use ${ctx.prefix}punishment to see more details of a punishment.`));
        }
    }
};

export default base.command;