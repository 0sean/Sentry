import { ErrorEmbed, SuccessEmbed } from "../Embeds";
import { CommandBase, ContentArg } from "../CommandBase";
import { identifyMember } from "../Permissions";
import { Paginator } from "../Paginator";
const base = new CommandBase();

base.name = "help";
base.description = "Shows commands and their information.";
base.contentArgs = [
    {name: "command", type: "string"}
];

base.run = (ctx, args) => {
    if(!args.command) {
        const pset = identifyMember(ctx), lvl = pset?.level || 0,
            commands = ctx.commandClient.commands.filter(c => {
                if (!c.metadata.permissions) {
                    return true;
                } else if (lvl >= c.metadata.permissions.level) {
                    return true;
                } else {
                    return false;
                }
            }),
            clist = commands.map(c => { return { name: c.name, value: c.metadata.description }; }),
            pages = [];

        for (let x = 0; x < clist.length; x += 6) {
            pages.push(clist.slice(x, x + 6));
        }

        new Paginator(ctx, pages, "ℹ️ Commands", `Here's the list of commands you have access to.\nDo \`${ctx.prefix}help <command>\` to see more information on a command such as usage.`);
    } else {
        const command = ctx.commandClient.commands.find(c => c.name == args.command);
        if(!command) return ctx.reply(ErrorEmbed("No command found with that name."));
        const usage: string[] = [];
        if(command.metadata.parseContentArgs) {
            (command.metadata.contentArgs as ContentArg[]).forEach(ca => {
                if(ca.type == "string") {
                    usage.push(`<${ca.name}>`);
                } else {
                    usage.push(`<${ca.type}>`);
                }
            });
        }
        ctx.reply(SuccessEmbed(`ℹ️ \`${command.name}\``, command.metadata.description, [{name: "Usage", value: `\`${ctx.prefix}${command.name} ${usage.join(" ")}\``}]));
    }
};

export default base.command;
