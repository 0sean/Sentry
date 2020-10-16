import { Context } from "../Client";
import { UnexpectedError } from "../UnexpectedError";
import { identifyMember } from "../Permissions";
import { Paginator } from "../Paginator";

export const command = {
    name: "help",
    metadata: {
        description: "Shows commands and their information."
    },
    onRunError: UnexpectedError,
    run: (ctx: Context): void => {
        const pset = identifyMember(ctx),
            userlevel = pset?.level || 0,
            commands = ctx.commandClient.commands.filter(command => {
                if(!command.metadata.permissions) {
                    return true;
                } else if (userlevel >= command.metadata.permissions.level) {
                    return true;
                } else {
                    return false;
                }
            }),
            clist = commands.map(c => {return {name: c.name, value: c.metadata.description};}),
            pages = [];

        for(let x = 0; x < clist.length; x+=6) {
            pages.push(clist.slice(x, x+6));
        }

        new Paginator(ctx, pages, "ℹ️ Commands", `Here's the list of commands you have access to. My prefix is \`${ctx.prefix}\`.`);
    }
};

export default command;