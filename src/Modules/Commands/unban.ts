import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { PS_GuildMod } from "../Permissions";
const base = new CommandBase();

base.name = "unban";
base.description = "Unbans users from the server.";
base.permissions = PS_GuildMod;

base.contentArgs = [
    {name: "member", type: "member"},
    {name: "reason", type: "string"}
];

base.run = async (ctx, args) => {
    if(typeof args.member != "string" || isNaN(parseInt(args.member))) {
        ctx.reply(ErrorEmbed("No valid ID was given."));
    } else {
        ctx.guild?.removeBan(args.member, {
            reason: `Unbanned by: ${ctx.member?.username}#${ctx.member?.discriminator} | Reason: ${args.reason as string || "No reason given"}`
        });
        ctx.reply(SuccessEmbed(`✅ Unbanned ID ${args.member}`));
    }
};

export default base.command;