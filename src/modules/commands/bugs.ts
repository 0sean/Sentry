import { CommandClient } from "detritus-client";
import { CommandOptions, Context } from "detritus-client/lib/command";
import { CommandBase } from "../CommandBase";
import { Embed } from "../Embeds";

export default class Command extends CommandBase {
    constructor(commandClient: CommandClient, options: CommandOptions) {
        super(commandClient, options);
        this.name = "bugs";
        this.aliases = ["issues", "github"];
    }
    metadata = {
        description: "Report bugs here."
    }

    async execute(ctx: Context) {
        ctx.reply(Embed({
            type: "info",
            title: "🐛 Report bugs",
            description: "[Click me to go to Sentry's GitHub issues page.](https://github.com/Anidox/Sentry/issues)\nPlease only report issues that originate from official Sentry features/code and not unofficial feature/code which may have been added in custom instances."
        }));
    }
}