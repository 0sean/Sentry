import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "../Command";
import { Embed } from "../Embeds";

export class PingCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "ping",
            description: "Checks the bot's ping to Discord."
        });
    }

    run(msg: CommandoMessage): null {
        msg.embed(Embed({
            type: "info",
            title: `🏓 Pong! Ping: \`${this.client.ws.ping}ms\``
        }));
        return null;
    }
}