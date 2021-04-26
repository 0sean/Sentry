import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "../Command";
import { Embed } from "../Embeds";
import { GuildMember } from "discord.js";
import { getHighest } from "../Permissions";
import Punishments from "../Punishments";

export class UnbanCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "unban",
            description: "Unbans a member from the server.",
            argsPromptLimit: 0,
            args: [
                {
                    key: "member",
                    label: "id",
                    prompt: "",
                    type: "string",
                    default: () => null
                },
                {
                    key: "reason",
                    prompt: "",
                    type: "string",
                    default: () => "No reason given."
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: {member: string | null, reason: string}): Promise<null> {
        if(getHighest(msg.member?.id || "", msg.guild.id).level == 0) {
            msg.embed(Embed({
                type: "error",
                title: "You don't have permission to run this command."
            }));
            return null;
        }
        if(!args.member) {
            msg.embed(Embed({
                type: "error",
                title: "No member to unban was specified."
            }));
        } else {
            if(args.member.length != 18 || isNaN(Number(args.member))) {
                msg.embed(Embed({
                    type: "error",
                    title: "Invalid member ID."
                }));
                return null;
            }
            const bans = await msg.guild.fetchBans();
            if(!bans.find(b => b.user.id == args.member)) {
                msg.embed(Embed({
                    type: "error",
                    title: "User not banned."
                }));
                return null;
            }
            msg.guild.members.unban(args.member, `Unbanned by ${msg.member?.user.username}#${msg.member?.user.discriminator} (${msg.member?.user.id})${args.reason != "No reason given." ? ` for "${args.reason}".`: ""}`);
            msg.embed(Embed({
                type: "success",
                title: `✅ Unbanned ID \`${args.member}\`.`,
                description: `The punishment was not deleted - use \`${this.client.commandPrefix}delpunishment\` to delete it.`
            }));
        }
        return null;
    }
}