import { CommandClient } from "detritus-client";
import { CommandOptions, Context, ParsedArgs } from "detritus-client/lib/command";
import { Command } from "detritus-client/lib/command/command";
import { Member, Role } from "detritus-client/lib/structures";
import { Embed } from "./Embeds";
import signale from "signale";

const logger = signale.scope("CommandBase");

function parseContentArgs(ctx: Context, args: ParsedArgs): Record<string, Member | Role | string> {
    // TODO: Make this
    return {};
}

export class CommandBase extends Command {
    metadata: {[key: string]: unknown} = {
        description: "No description given",
        contentArgs: []
    }

    disableDm = true

    run: CommandOptions["run"] = (context, args: ParsedArgs) => {
        const contentArgs = parseContentArgs(context, args);
        try {
            if(this.execute) {
                this.execute(context, contentArgs, args);
            }
        } catch (err) {
            logger.error(err);
            context.reply(Embed({
                type: "error",
                title: err.message,
                description: "You shouldn't have seen this. Notify the bot owner if this continues."
            }));
        }
    }

    execute?(ctx: Context, contentArgs?: Record<string, Member | Role | string>, args?: ParsedArgs): void
}