import { Context } from "../Client";
import { SuccessEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";
import { identifyMember } from "../Permissions";

export const command = {
    name: "permissions",
    metadata: {
        description: "Shows your permission level."
    },
    onRunError: UnexpectedError,
    run: (ctx: Context): void => {
        const pset = identifyMember(ctx);
        ctx.reply(SuccessEmbed(`Your permission level is ${pset?.prettyName.toLowerCase()}.`, `Also known as level ${pset?.level.toString()}.`));
    }
};

export default command;