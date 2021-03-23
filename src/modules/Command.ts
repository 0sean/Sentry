import { Command as DCommand, CommandoClient, CommandInfo as DCommandInfo } from "discord.js-commando";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type CommandInfo = Optional<Omit<DCommandInfo, "memberName">, "group">;

export abstract class Command extends DCommand {
    constructor(client: CommandoClient, info: CommandInfo) {
        const { group, ...unusedInfo } = info;

        super(client, {
            memberName: info.name,
            guildOnly: true,
            group: group || "utility",
            ...unusedInfo
        });
    }
}