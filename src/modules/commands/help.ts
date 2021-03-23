import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "../Command";
import { Embed } from "../Embeds";

export class HelpCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "help",
            description: "Lists the bot's commands and how to use them.",
            aliases: ["commands"]
        });
    }

    run(msg: CommandoMessage): null {
        // TODO: Allow the user to specify a command
        // TODO: Autoselect the user's permission level
        msg.embed(Embed({
            type: "info",
            title: "❔ Click me to see all commands.",
            url: process.env.WEB_DOMAIN + "commands"
        }));
        return null;
    }
}