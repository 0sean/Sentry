import { Context } from "../Client";
import { InProgressEmbed, SuccessEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";

export const command = {
    name: "ping",
    metadata: {
        description: "Checks the bot's ping to Discord."
    },
    onRunError: UnexpectedError,
    run: (ctx: Context): void => {
        const now = Date.now();
        ctx.reply(InProgressEmbed("🔄 Finding ping...", "If this message never changes, try again - it means the bot either errored or was ratelimited."))
            .then((message) => {
                const ping = Date.now() - now;
                message.edit(SuccessEmbed(`🏓 Pong! Ping = ${ping}ms`));
            });
    }
};

export default command;