import { ErrorEmbed } from "./Embeds";
import { Context } from "./Client";
import { ParsedArgs } from "detritus-client/lib/command";
export function UnexpectedError(ctx: Context, args: ParsedArgs, error: Error): void  {
    console.log(error);
    ctx.reply(ErrorEmbed(error.message, "This shouldn't have happened. Try again?"));
}