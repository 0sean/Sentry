import { SuccessEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
const base = new CommandBase();

base.name = "bugs";
base.description = "Report bugs here.";
base.aliases = ["issues", "github"];

base.run = (ctx) => {
    ctx.reply(SuccessEmbed("🐛 Report bugs", "[Click me to go to Sentry's GitHub issues page.](https://github.com/Anidox/Sentry/issues)\nPlease only report issues with official Sentry features and not unofficial features added in custom instances."));
};

export default base.command;