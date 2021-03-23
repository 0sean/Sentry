import getPackageVersion from "@jsbits/get-package-version";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "../Command";
import { Embed } from "../Embeds";

export class InfoCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "info",
            description: "Shows info about Sentry.",
            aliases: ["about"]
        });
    }

    run(msg: CommandoMessage): null {
        msg.embed(Embed({
            type: "info",
            title: "👋 Hi, I'm Sentry.",
            description: "**Moderate with ease.**\nA Discord bot focused on easy moderation.",
            fields: [
                {name: "🤖 Bot version", value: `\`${getPackageVersion()}\``},
                {name: "🌍 Server count", value: `\`${this.client.guilds.cache.size}\``},
                {name: "👥 User count", value: `\`${this.client.users.cache.filter(u => !u.bot).size}\``}
            ]
        }));
        return null;
    }
}