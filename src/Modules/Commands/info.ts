import { SuccessEmbed } from "../Embeds";
import getPackageVersion from "@jsbits/get-package-version";
import { CommandBase } from "../CommandBase";
const base = new CommandBase();

base.name = "info";
base.description = "Shows info about the bot.";

base.run = (ctx) => {
    const servers = ctx.guilds.size, users = ctx.users.filter(u => !u.bot).length;
    ctx.reply(SuccessEmbed("👋 Hi, I'm Sentry.", "A Discord bot designed to give your moderators a break.", [{name: "🤖 Bot version", value: `\`${getPackageVersion()}\``}, {name: "🌎 Server count", value: `\`${servers}\``}, {name: "👥 User count", value: `\`${users}\``}]));
};

export default base.command;