import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { PS_GuildMod } from "../Permissions";
import { ChannelGuildText } from "detritus-client/lib/structures";
const base = new CommandBase();

base.name = "purge";
base.description = "Purges messages from the current channel. Limited to 100 messages at a time.";
base.permissions = PS_GuildMod;
base.contentArgs = [
    {name: "amount", type: "string"}
];

base.run = async (ctx, args) => {
    if(!args.amount) return ctx.reply(ErrorEmbed("No amount given."));
    if(isNaN(parseInt(args.amount as string))) return ctx.reply(ErrorEmbed("Amount should be a number."));
    await ctx.message.delete();
    const amount = parseInt(args.amount as string) > 100 ? 100 : parseInt(args.amount as string);
    if(amount < 2) return ctx.reply(ErrorEmbed("Amount must be at least 2."));
    const messages = await ctx.channel?.fetchMessages({
        limit: amount
    });
    ctx.channel?.bulkDelete(messages.map((m: ChannelGuildText) => m.id));
    ctx.reply(SuccessEmbed(`✅ Purged ${amount} messages.`, undefined, undefined, `Executed by ${ctx.member?.username}#${ctx.member?.discriminator}`));
};

export default base.command;