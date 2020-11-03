import { SuccessEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { identifyMember } from "../Permissions";
const base = new CommandBase();

base.name = "permissions";
base.description = "Shows your permission level in this server.";

base.run = (ctx) => {
    const pset = identifyMember(ctx);
    ctx.reply(SuccessEmbed(`Your permission level is ${pset ? pset.prettyName.toLowerCase() : "member"}.`, `Also known as level ${pset ? pset.level.toString() : 0}.`));
};

export default base.command;