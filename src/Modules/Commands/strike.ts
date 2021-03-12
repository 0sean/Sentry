import { ErrorEmbed, SuccessEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { identifyMember, PS_GuildMod } from "../Permissions";
import { Member } from "detritus-client/lib/structures";
import random from "crypto-random-string";
const base = new CommandBase();

base.name = "strike";
base.description = "Strikes a member.";
base.permissions = PS_GuildMod;

base.contentArgs = [
    {name: "member", type: "member"},
    {name: "reason", type: "string"}
];

base.run = (ctx, args) => {
    if(!args.member || typeof args.member == "string") return ctx.reply(ErrorEmbed("No valid member mention was given."));
    const member = args.member as Member, id = random({length: 7}),
        memberLevel = identifyMember(ctx)?.level || 0, mentionLevel = identifyMember(ctx, member)?.level || 0;
    if(mentionLevel >= memberLevel) return ctx.reply(ErrorEmbed("You cannot kick this person as they have an equivalent or higher permission level to you."));
    ctx.commandClient.db.collection("punishments").insertOne({
        punishId: id,
        guildId: ctx.guildId,
        reason: args.reason || "No reason given.",
        type: "strike",
        automated: false,
        subjectId: member.id,
        actorId: ctx.member?.id
    });
    member.createMessage(SuccessEmbed(`🔨 You were striked in ${ctx.guild?.name} for \`${args.reason}\`.`));
    ctx.reply(SuccessEmbed(`✅ Striked ${member.username}`, `Punishment ID \`${id}\``));
};

export default base.command;