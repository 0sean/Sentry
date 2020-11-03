import { SuccessEmbed, InProgressEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
const base = new CommandBase();

base.name = "ping";
base.description = "Checks the bot's ping to Discord.";

base.run = async (ctx) => {
    const ping = await ctx.client.ping();
    ctx.reply(SuccessEmbed(`🏓 Pong! Ping = ${ping.rest}ms`, `Gateway ping: ${ping.gateway}ms`));
};

export default base.command;