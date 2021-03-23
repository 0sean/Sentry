import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "../Command";
import { Embed } from "../Embeds";

export class BugsCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "bugs",
            description: "Report bugs here.",
            aliases: ["issues, github"]
        });
    }

    run(msg: CommandoMessage): null {
        msg.embed(Embed({
            type: "info",
            title: "🐛 Report bugs",
            description: "**[Click me to go to Sentry's GitHub issues page.](https://github.com/Anidox/Sentry/issues)**\nPlease only report issues that originate from official Sentry features/code and not unofficial features/code which may have been added in custom instances."
        }));
        return null;
    }
}