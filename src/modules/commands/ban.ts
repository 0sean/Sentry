import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "../Command";
import { Embed } from "../Embeds";
import { GuildMember } from "discord.js";
import { getHighest } from "../Permissions";
import Punishments from "../Punishments";

export class BanCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "ban",
            description: "Bans a member from the server.",
            argsPromptLimit: 0,
            args: [
                {
                    key: "member",
                    label: "@mention|id",
                    prompt: "",
                    type: "member|string",
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

    run(msg: CommandoMessage, args: {member: GuildMember | string | null, reason: string}): null {
        if(getHighest(msg.member?.id || "", msg.guild.id).level == 0) {
            msg.embed(Embed({
                type: "error",
                title: "You don't have permission to run this command."
            }));
            return null;
        }
        const Punishment = new Punishments(msg.guild.id);
        if(!args.member) {
            msg.embed(Embed({
                type: "error",
                title: "No member to ban was specified."
            }));
        } else if(typeof args.member == "string") {
            if(args.member.length != 18 || isNaN(Number(args.member))) {
                msg.embed(Embed({
                    type: "error",
                    title: "Invalid member ID."
                }));
                return null;
            }
            msg.guild.members.ban(args.member, {reason: `Banned by ${msg.member?.user.username}#${msg.member?.user.discriminator} (${msg.member?.user.id})${args.reason != "No reason given." ? ` for "${args.reason}".`: ""}`});
            const punishment = Punishment.add({
                type: "ban",
                reason: args.reason,
                actorID: msg.author.id,
                subjectID: args.member
            });
            msg.embed(Embed({
                type: "success",
                title: `✅ Banned ID \`${args.member}\`.`,
                description: `Punishment ID: \`${punishment}\` `
            }));
        } else {
            const { member } = args;
            if(!member.bannable) {
                msg.embed(Embed({
                    type: "error",
                    title: "Member has higher role than bot."
                }));
                return null;
            }
            if(getHighest(member.id, msg.guild.id).level >= getHighest(msg.member?.id || "", msg.guild.id).level) {
                msg.embed(Embed({
                    type: "error",
                    title: "You have a lower permission level than the member you are trying to ban."
                }));
                return null;
            }
            member.send(Embed({
                type: "info",
                title: `⚠️ You were banned in \`${msg.guild.name}\`${args.reason != "No reason given." ? ` for \`${args.reason}\`.`: "."}`
            })).catch(() => null).finally(() => {
                const punishment = Punishment.add({
                    type: "ban",
                    reason: args.reason,
                    actorID: msg.author.id,
                    subjectID: member.id
                });
                member?.ban({reason: `Banned by ${msg.member?.user.username}#${msg.member?.user.discriminator} (${msg.member?.user.id})${args.reason != "No reason given." ? ` for "${args.reason}"`: ""} - punishment ID ${punishment}`});
                msg.embed(Embed({
                    type: "success",
                    title: `✅ Banned \`${member?.user.username}#${member?.user.discriminator}\`.`,
                    description: `Punishment ID: \`${punishment}\` `
                }));
            });
        }
        return null;
    }
}