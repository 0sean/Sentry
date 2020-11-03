import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { PS_GuildMod } from "../Permissions";
import { Member } from "detritus-client/lib/structures";
import random from "crypto-random-string";
const base = new CommandBase();

base.name = "ban";
base.description = "Bans users in the server.";
base.permissions = PS_GuildMod;

base.contentArgs = [
    {name: "member", type: "member"},
    {name: "reason", type: "string"}
];
base.args = [{
    name: "purge",
    aliases: ["p"],
    metadata: {
        description: "How long to purge messages for from that user in days."
    },
    default: "0",
    type: String
}];

base.run = async (ctx, args, parsedArgs) => {
    parsedArgs.purge = parsedArgs.purge.split(" ")[0];
    if(!args.member || (typeof args.member == "string" && isNaN(parseInt(args.member)))) {
        ctx.reply(ErrorEmbed("No valid member was given."));
    } else if(typeof args.member == "string") {
        const id = random({length: 7});
        ctx.guild?.createBan(args.member, {
            reason: args.reason as string || "No reason given",
            deleteMessageDays: parsedArgs.purge
        });
        ctx.commandClient.db.collection("punishments").insertOne({
            punishId: id,
            guildId: ctx.guildId,
            reason: args.reason || "No reason given.",
            type: "ban",
            automated: false,
            subjectId: args.member,
            actorId: ctx.member?.id
        });
        ctx.reply(SuccessEmbed(`✅ Banned ID ${args.member}`, `Punishment ID \`${id}\``));
    } else {
        const member = args.member as Member, id = random({length: 7});
        await member.createMessage(SuccessEmbed(`🔨 You were banned in ${ctx.guild?.name} for \`${args.reason || "No reason given"}\`.`));
        member.ban({
            reason: args.reason as string || "No reason given",
            deleteMessageDays: parsedArgs.purge
        });
        ctx.commandClient.db.collection("punishments").insertOne({
            punishId: id,
            guildId: ctx.guildId,
            reason: args.reason || "No reason given.",
            type: "ban",
            automated: false,
            subjectId: member.id,
            actorId: ctx.member?.id
        });
        ctx.reply(SuccessEmbed(`✅ Banned ${member.username}`, `Punishment ID \`${id}\``));
    }
};

export default base.command;