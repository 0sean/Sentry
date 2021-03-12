import { CommandClient } from "detritus-client";
import { CommandOptions, Context } from "detritus-client/lib/command";
import { CommandBase } from "../CommandBase";
import { Embed } from "../Embeds";
import getPackageVersion from "@jsbits/get-package-version";

export default class Command extends CommandBase {
    constructor(commandClient: CommandClient, options: CommandOptions) {
        super(commandClient, options);
        this.name = "info";
        this.aliases = ["about"];
    }
    metadata = {
        description: "Shows info about Sentry."
    }

    async execute(ctx: Context) {
        ctx.reply(Embed({
            type: "info",
            title: "👋 Hi, I'm Sentry.",
            description: "**Moderate with ease.**\nA Discord bot focused on easy moderation.",
            fields: [
                {name: "🤖 Bot version", value: `\`${getPackageVersion()}\``},
                {name: "🌍 Server count", value: `\`${ctx.guilds.size}\``},
                {name: "👥 User count", value: `\`${ctx.users.filter(u => !u.bot).length}\``}
            ]
        }));
    }
}