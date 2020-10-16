import { Context } from "../Client";
import { SuccessEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";
import { PS_BotOwner } from "../Permissions";
import signale from "signale";

export const command = {
    name: "stop",
    metadata: {
        description: "Stops the bot.",
        permissions: PS_BotOwner
    },
    onBefore: PS_BotOwner.identify,
    onRunError: UnexpectedError,
    run: (ctx: Context): void => {
        ctx.reply(SuccessEmbed("👋 Shutting down, goodbye!")).then(() => {
            ctx.commandClient.kill();
            signale.success("Shutting down bot due to stop command.");
            process.exit(0);
        });
    }
};

export default command;