import { GuildMember } from "discord.js";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "../Command";
import { Embed } from "../Embeds";
import Punishments from "../Punishments";

export class PunishmentsCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "punishments",
            description: "Lists a member's punishments.",
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
                    key: "type",
                    prompt: "",
                    type: "string",
                    default: () => "all"
                }
            ]
        });
    }

    run(msg: CommandoMessage, args: {member: GuildMember | string | null, type: string}): null {
        if(!args.member) {
            msg.embed(Embed({
                type: "error",
                title: "No member was specified."
            }));
            return null;
        } 
        if(!["all", "strike", "kick", "ban"].includes(args.type)) {
            msg.embed(Embed({
                type: "error",
                title: "Invalid punishment type.",
                description: "Valid types are `all`, `strike`, `kick`, `ban`"
            }));
            return null;
        }
        const Punishment = new Punishments(msg.guild.id);
        if(typeof args.member == "string") {
            if(args.member.length != 18 || isNaN(Number(args.member))) {
                msg.embed(Embed({
                    type: "error",
                    title: "Invalid member ID."
                }));
                return null;
            }
            const punishments = Punishment.getMember(args.member).filter(args.type == "all" ? () => true : p => p.type == args.type);
            if(punishments.length == 0) {
                msg.embed(Embed({
                    type: "info",
                    title: `✅ ID \`${args.member}\` has no punishments.`
                }));
            } else {
                msg.embed(Embed({
                    type: "info",
                    title: `🛠️ ID \`${args.member}\`'s punishments.`,
                    description: args.type == "all" ? "" : `Showing only type \`${args.type}\``,
                    fields: punishments.map(p => { return {name: `ID \`${p.punishmentID}\` | Type: ${p.type}`, value: p.reason}; })
                }));
            }
        } else {
            const punishments = Punishment.getMember(args.member.id).filter(args.type == "all" ? () => true : p => p.type == args.type);
            if(punishments.length == 0) {
                msg.embed(Embed({
                    type: "info",
                    title: `✅ \`${args.member?.user.username}#${args.member?.user.discriminator}\` has no punishments.`
                }));
            } else {
                msg.embed(Embed({
                    type: "info",
                    title: `🛠️ ID \`${args.member?.user.username}#${args.member?.user.discriminator}\`'s punishments.`,
                    description: args.type == "all" ? "" : `Showing only type \`${args.type}\``,
                    fields: punishments.map(p => { return {name: `ID \`${p.punishmentID}\` | Type: ${p.type}`, value: p.reason}; })
                }));
            }
        }
        return null;
    }
}