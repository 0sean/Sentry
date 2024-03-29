import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { identifyMember, PS_GuildMod } from "../Permissions";
import { Member } from "detritus-client/lib/structures";
import random from "crypto-random-string";
const base = new CommandBase();

base.name = "ban";
base.description = "Bans users from the server.";
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
        if(ctx.guild?.fetchMember(args.member)) {
            const member = await ctx.guild?.fetchMember(args.member), memberLevel = identifyMember(ctx)?.level || 0, mentionLevel = identifyMember(ctx, member)?.level || 0;
            if(mentionLevel >= memberLevel) return ctx.reply(ErrorEmbed("You cannot ban this person as they have an equivalent or higher permission level to you."));
        }
        ctx.guild?.createBan(args.member, {
            reason: `Punished by: ${ctx.member?.username}#${ctx.member?.discriminator} | Reason: ${args.reason as string || "No reason given"} | Punishment ID: ${id}`,
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
        const member = args.member as Member, id = random({length: 7}),
            memberLevel = identifyMember(ctx)?.level || 0, mentionLevel = identifyMember(ctx, member)?.level || 0;
        if(mentionLevel >= memberLevel) return ctx.reply(ErrorEmbed("You cannot kick this person as they have an equivalent or higher permission level to you."));
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