import { CommandClient } from "detritus-client";
import { CommandOptions, Context } from "detritus-client/lib/command";
import { CommandBase } from "../CommandBase";
import { Embed } from "../Embeds";

export default class Command extends CommandBase {
    constructor(commandClient: CommandClient, options: CommandOptions) {
        super(commandClient, options);
        this.name = "ping";
    }
    metadata = {
        description: "Checks the bot's ping to Discord."
    }

    async execute(ctx: Context) {
        const ping = await ctx.client.ping();
        ctx.reply(Embed({
            type: "info",
            title: `🏓 Pong! Ping: ${ping.rest}ms`,
            description: `Gateway ping: ${ping.gateway}ms`
        }));
    }
}