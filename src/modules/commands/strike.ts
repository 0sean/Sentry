import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "../Command";
import { Embed } from "../Embeds";
import { GuildMember } from "discord.js";
import { getHighest } from "../Permissions";
import Punishments from "../Punishments";

export class StrikeCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "strike",
            description: "Strikes a member.",
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
                title: "No member to strike was specified."
            }));
        } else if(typeof args.member == "string") {
            if(args.member.length != 18 || isNaN(Number(args.member))) {
                msg.embed(Embed({
                    type: "error",
                    title: "Invalid member ID."
                }));
                return null;
            }
            const Punishment = new Punishments(msg.guild.id);
            if(getHighest(args.member, msg.guild.id).level >= getHighest(msg.member?.id || "", msg.guild.id).level) {
                msg.embed(Embed({
                    type: "error",
                    title: "You have a lower permission level than the member you are trying to strike."
                }));
                return null;
            }
            const punishment = Punishment.add({
                    type: "strike",
                    reason: args.reason,
                    actorID: msg.author.id,
                    subjectID: args.member
                }), punishments = Punishment.getMember(args.member).filter(p => p.type == "strike");
            msg.embed(Embed({
                type: "success",
                title: `✅ Striked ID \`${args.member}\`.`,
                description: `Punishment ID: \`${punishment}\`\nThey now have **${punishments.length} strike${punishments.length > 1 ? "s" : ""}**`
            }));
        } else {
            const { member } = args, Punishment = new Punishments(msg.guild.id);
            if(getHighest(member.id, msg.guild.id).level >= getHighest(msg.member?.id || "", msg.guild.id).level) {
                msg.embed(Embed({
                    type: "error",
                    title: "You have a lower permission level than the member you are trying to strike."
                }));
                return null;
            }
            member.send(Embed({
                type: "info",
                title: `⚠️ You were striked in \`${msg.guild.name}\`${args.reason != "No reason given." ? ` for \`${args.reason}\`.`: "."}`
            })).catch(() => null).finally(() => {
                const punishment = Punishment.add({
                        type: "strike",
                        reason: args.reason,
                        actorID: msg.author.id,
                        subjectID: member.id
                    }),
                    punishments = Punishment.getMember(member.id).filter(p => p.type == "strike");
                msg.embed(Embed({
                    type: "success",
                    title: `✅ Striked \`${member?.user.username}#${member?.user.discriminator}\`.`,
                    description: `Punishment ID: \`${punishment}\`\nThey now have **${punishments.length} strike${punishments.length > 1 ? "s" : ""}**`
                }));
            });
        }
        return null;
    }
}