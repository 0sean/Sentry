import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "../Command";
import { Embed } from "../Embeds";
import { GuildMember } from "discord.js";
import { getHighest } from "../Permissions";
import Punishments from "../Punishments";

export class KickCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "kick",
            description: "Kicks a member from the server.",
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

    async run(msg: CommandoMessage, args: {member: GuildMember | string | null, reason: string}): Promise<null> {
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
                title: "No member to kick was specified."
            }));
        } else if(typeof args.member == "string") {
            msg.embed(Embed({
                type: "error",
                title: "Invalid member"
            }));
        } else {
            const { member } = args, Punishment = new Punishments(msg.guild.id);
            if(!member.kickable) {
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
                title: `⚠️ You were kicked in \`${msg.guild.name}\`${args.reason != "No reason given." ? ` for \`${args.reason}\`.`: "."}`
            })).catch(() => null).finally(() => {
                const punishment = Punishment.add({
                    type: "kick",
                    reason: args.reason,
                    actorID: msg.author.id,
                    subjectID: member.id
                });
                member?.kick(`Kicked by ${msg.member?.user.username}#${msg.member?.user.discriminator} (${msg.member?.user.id})${args.reason != "No reason given." ? ` for "${args.reason}"`: ""} - punishment ID ${punishment}`);
                msg.embed(Embed({
                    type: "success",
                    title: `✅ Kicked \`${member?.user.username}#${member?.user.discriminator}\`.`,
                    description: `Punishment ID: \`${punishment}\` `
                }));
            });
        }
        return null;
    }
}