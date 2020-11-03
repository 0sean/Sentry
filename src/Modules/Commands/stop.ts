import { SuccessEmbed } from "../Embeds";
import { PS_BotOwner } from "../Permissions";
import { CommandBase } from "../CommandBase";
import signale from "signale";
const base = new CommandBase();

base.name = "stop";
base.description = "Stops the bot.";
base.permissions = PS_BotOwner;

base.run = async (ctx) => {
    await ctx.reply(SuccessEmbed("👋 Shutting down, goodbye!"));
    ctx.commandClient.kill();
    await ctx.commandClient.mongo.close();
    signale.success("Shutting down bot due to stop command.");
    process.exit(0);
};

export default base.command;