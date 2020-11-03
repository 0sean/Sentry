import { CommandOptions, ParsedArgs, Context, ArgumentOptions } from "detritus-client/lib/command";
import { Channel, Member, Role } from "detritus-client/lib/structures";
import signale from "signale";
import { ErrorEmbed } from "./Embeds";
import { PermissionSet } from "./Permissions";
import { Context as ClientContext } from "./Client";

export interface ContentArg {
    name: string
    type: "string" | "channel" | "member" | "role";
}

export interface Command extends CommandOptions {
    metadata: Record<string, unknown>
}

export class CommandBase {
    command: Command
    constructor() {
        this.command = {
            name: "",
            metadata: {
                description: "No description given.",
                parseContentArgs: false
            },
            disableDm: true
        };
    }

    parseContentArgs(args: ParsedArgs, ctx: Context): Record<string, string | Channel | Member | Role | undefined> {
        if(!this.command.metadata?.parseContentArgs) return {};
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const values = args[ctx.command!.name].split(" "), out = {} as Record<string, string | Channel | Member | Role | undefined>;
        (this.command.metadata.contentArgs as ContentArg[])?.forEach((v, i) => {
            // out[v.name] = values[i];
            if(!values[i]) return;
            if(v.type == "string") {
                if(i+1 == (this.command.metadata?.contentArgs as ContentArg[])?.length && !(i+1 == values.length)) {
                    out[v.name] = values.slice(-values.length + i).join(" ");
                } else {
                    out[v.name] = values[i];
                }
            } else if (v.type == "channel") {
                if(values[i].startsWith("<#")) {
                    const channel = ctx.guild?.channels.find(c => c.id == values[i].slice(2, -1));
                    out[v.name] = channel;
                } else {
                    const channel = ctx.guild?.channels.find(c => c.name == values[i]);
                    out[v.name] = channel;
                }
            } else if (v.type == "member") {
                if(values[i].startsWith("<@!")) {
                    const member = ctx.guild?.members.find(m => m.id == values[i].slice(3, -1));
                    out[v.name] = member;
                } else {
                    if(!isNaN(values[i])) {
                        out[v.name] = values[i];
                    }
                }
            } else if (v.type == "role") {
                if(values[i].startsWith("<@&")) {
                    const role = ctx.guild?.roles.find(r => r.id == values[i].slice(3, -1));
                    out[v.name] = role;
                } else {
                    const role = ctx.guild?.roles.find(r => r.name == values[i]);
                    out[v.name] = role;
                }
            }
        });
        return out;
    }

    set run(callback: (context: ClientContext, contentArgs: Record<string, string | Channel | Member | Role | undefined>, args: ParsedArgs) => void) {
        this.command.run = (context: Context, args) => {
            const ctx = context as unknown as ClientContext;
            const contentArgs = this.parseContentArgs(args, ctx);
            try {
                callback(ctx, contentArgs, args);
            } catch (err) {
                signale.error(err);
                ctx.reply(ErrorEmbed(err.message, "You shouldn't have seen this. Notify the bot owner if this continues."));
            }
        };
    }

    set permissions(permissions: PermissionSet) {
        this.command.onBefore = permissions.identify;
        this.command.metadata.permissions = permissions;
    }

    set name(name: string) {
        this.command.name = name;
    }

    set contentArgs(value: ContentArg[]) {
        this.command.metadata.parseContentArgs = true;
        this.command.metadata.contentArgs = value;
    }

    set description(value: string) {
        this.command.metadata.description = value;
    }

    set args(value: ArgumentOptions[]) {
        this.command.args = value;
    }

    set aliases(value: string[]) {
        this.command.aliases = value;
    }
}