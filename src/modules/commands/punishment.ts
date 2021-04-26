import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "../Command";
import { Embed } from "../Embeds";
import Punishments from "../Punishments";

export class PunishmentCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "punishment",
            description: "Shows info about a punishment.",
            argsPromptLimit: 0,
            args: [
                {
                    key: "id",
                    prompt: "",
                    type: "string",
                    default: () => null
                }
            ]
        });
    }

    run(msg: CommandoMessage, args: {id: string | null}): null {
        if(!args.id) {
            msg.embed(Embed({
                type: "error",
                title: "No punishment ID was specified."
            }));
            return null;
        }
        const Punishment = new Punishments(msg.guild.id),
            punishment = Punishment.getID(args.id);
        if(!punishment) {
            msg.embed(Embed({
                type: "error",
                title: "Punishment was not found."
            }));
            return null;
        }
        const actor = msg.guild.members.cache.get(punishment.actorID),
            subject = msg.guild.members.cache.get(punishment.subjectID);
        msg.embed(Embed({
            type: "info",
            title: `🛠️ Punishment ID \`${punishment}\``,
            fields: [{
                name: "Type",
                value: `\`${punishment.type}\``
            }, {
                name: "Reason",
                value: `\`${punishment.reason}\``
            }, {
                name: "Actor",
                value: `\`${actor ? `${actor.user.username}#${actor.user.discriminator}` : `ID \`${punishment.actorID}\`` }\``
            }, {
                name: "Subject",
                value: `\`${subject ? `${subject.user.username}#${subject.user.discriminator}` : `ID \`${punishment.subjectID}\`` }\``
            }]
        }));
        return null;
    }
}