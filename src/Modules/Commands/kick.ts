import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { PS_GuildMod, identifyMember } from "../Permissions";
import random from "crypto-random-string";
import { Member } from "detritus-client/lib/structures";
const base = new CommandBase();

base.name = "kick";
base.description = "Kicks users in the server.";
base.permissions = PS_GuildMod;

base.contentArgs = [
    {name: "member", type: "member"},
    {name: "reason", type: "string"}
];

base.run = async (ctx, args) => {
    if(!args.member || typeof args.member == "string") {
        ctx.reply(ErrorEmbed("No valid member mention was given."));
    } else {
        const member = args.member as Member, id = random({length: 7}),
            memberLevel = identifyMember(ctx)?.level || 0, mentionLevel = identifyMember(ctx, member)?.level || 0;
        if(mentionLevel >= memberLevel) return ctx.reply(ErrorEmbed("You cannot kick this person as they have an equivalent or higher permission level to you."));
        await member.createMessage(SuccessEmbed(`🔨 You were kicked in ${ctx.guild?.name} for \`${args.reason || "No reason given"}\`.`));
        member.remove({
            reason: `Punished by: ${ctx.member?.username}#${ctx.member?.discriminator} | Reason: ${args.reason as string || "No reason given"} | Punishment ID: ${id}`
        });
        ctx.commandClient.db.collection("punishments").insertOne({
            punishId: id,
            guildId: ctx.guildId,
            reason: args.reason || "No reason given",
            type: "kick",
            automated: false,
            subjectId: member.id,
            actorId: ctx.member?.id
        });
        ctx.reply(SuccessEmbed(`✅ Kicked ${member.username}`, `Punishment ID \`${id}\``));
    }
};

export default base.command;