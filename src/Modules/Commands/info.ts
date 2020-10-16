import { Context } from "../Client";
import { SuccessEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";
import getPackageVersion from "@jsbits/get-package-version";

export const command = {
    name: "info",
    metadata: {
        description: "Shows info about the bot."
    },
    onRunError: UnexpectedError,
    run: async (ctx: Context): Promise<void> => {
        const servers = ctx.guilds.size,
            users = ctx.users.filter(user => !user.bot).length;
        ctx.reply(SuccessEmbed("👋 Hi, I'm Sentry.", "A Discord bot designed to give your moderators a break.", [{name: "🤖 Bot version", value: `\`${getPackageVersion()}\``}, {name: "🌎 Server count", value: `\`${servers}\``}, {name: "👥 User count", value: `\`${users}\``}]));
    }
};

export default command;