import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { CommandBase } from "../CommandBase";
import { PS_GuildOwner } from "../Permissions";
import { AwaitMessage, AwaitReaction } from "../Awaiters";
import { Message } from "detritus-client/lib/structures";
const base = new CommandBase();

base.name = "config";
base.description = "Configure Sentry for your server.";
base.permissions = PS_GuildOwner;
base.aliases = ["setup"];

interface Setting {
    emoji: string,
    name: string,
    description: string,
    type: "role" | "channel",
    enable: string,
    field: string
}

type AwaitedPromise<T> = T extends Promise<infer U> ? U : T

base.run = async (ctx) => {
    const settings: Setting[] = [{
        emoji: "🛡️",
        name: "Verify",
        description: "Configure Sentry's bot and VPN detection.",
        type: "role",
        enable: "type the name of the role you want assigned to new members when they verify.\n[Click me to see how your roles should be set up - this is important!](https://notion.so/)",
        field: "verify"
    }, {
        emoji: "👮",
        name: "Moderator permissions",
        description: "Choose who gets moderator permissions on Sentry.",
        type: "role",
        enable: "type the name of the role you want to give moderator permissions.",
        field: "modRole"
    }, {
        emoji: "👋",
        name: "Join/leave messages",
        description: "Choose if/where join/leave message get sent.",
        type: "channel",
        enable: "type the name (not the mention) of the channel you want join/leave messages sent to",
        field: "joinLeaveMessages"
    }],
        message = await ctx.reply(SuccessEmbed("🔧 Configure Sentry", undefined, settings.map(s => { return {name: `${s.emoji} ${s.name}`, value: s.description}; }), "Click the buttons below to select a setting or click the ❌ button to close it."));
    settings.forEach(async (s) => {
        await message.react(s.emoji);
    });
    await message.react("❌");
    const arm = await AwaitReaction(ctx, e => e?.messageId == message.id && (settings.map(s => s.emoji).includes(e.reaction.emoji.toString()) || e.reaction.emoji.toString() == "❌"), 600000);
    let arx: AwaitedPromise<ReturnType<typeof AwaitReaction>>, am: AwaitedPromise<ReturnType<typeof AwaitMessage>>;
    arm.promise.then(async (r) => {
        if(r.emoji.toString() == "❌") {
            message.deleteReactions();
            return message.edit(SuccessEmbed("Exited config.", "No changes were made."));
        }
        const setting = settings.find(s => s.emoji == r.emoji.toString()) as Setting,
            document = await ctx.commandClient.db.collection("guildSettings").findOne({
                guildId: ctx.guildId
            }) || {};
        await message.deleteReactions();
        await message.react("❌");
        let msg: Message;
        if(!document[setting.field]) {
            msg = await message.edit(SuccessEmbed(`${setting.emoji} ${setting.name}`, `${setting.name} is disabled. To enable it, ${setting.enable}`, undefined, "To exit without saving, click the ❌ button below."));
        } else {
            if(setting.type == "role") {
                const role = ctx.guild?.roles.find(r => r.id == document[setting.field]);
                if(!role) {
                    msg = await message.edit(SuccessEmbed(`${setting.emoji} ${setting.name}`, `${setting.name} is disabled as its role was deleted. To change it, ${setting.enable}`, undefined, "To exit without saving, click the ❌ button below."));
                } else {
                    msg = await message.edit(SuccessEmbed(`${setting.emoji} ${setting.name}`, `${setting.name} is enabled with role \`${role.name}\`. To disable it, type \`off\`. To change it, ${setting.enable}`, undefined, "To exit without saving, click the ❌ button below."));
                }
            } else if (setting.type == "channel") {
                const channel = ctx.guild?.channels.find(c => c.id == document[setting.field]);
                if(!channel) {
                    msg = await message.edit(SuccessEmbed(`${setting.emoji} ${setting.name}`, `${setting.name} is disabled as its channel was deleted. To disable it, type \`off\`. To change it, ${setting.enable}`, undefined, "To exit without saving, click the ❌ button below."));
                } else {
                    msg = await message.edit(SuccessEmbed(`${setting.emoji} ${setting.name}`, `${setting.name} is enabled with role \`${channel.name}\`. To disable it, type \`off\`. To change it, ${setting.enable}`, undefined, "To exit without saving, click the ❌ button below."));
                }
            }
        }
        arx = await AwaitReaction(ctx, e => e?.messageId == msg.id && e.reaction.emoji.toString() == "❌");
        am = await AwaitMessage(ctx, () => true);
        arx.promise.then(() => {
            msg.edit(SuccessEmbed("Exited config.", "No changes were made."));
            msg.deleteReactions();
            am.cancel();
        }).catch(() => {
            return;
        });
        am.promise.then(m => {
            const content = m.content;
            m.delete();
            msg.deleteReactions();
            const set: Record<string, unknown> = {};
            set[setting.field] = "";
            if(m.content.trim() == "off") {
                set[setting.field] = "";
            } else {
                if(setting.type == "role") {
                    const role = ctx.guild?.roles.find(r => r.name == content);
                    if(!role) { 
                        msg.edit(SuccessEmbed("Role not found.", "No changes were made."));
                        arx.cancel();
                        return;
                    }
                    set[setting.field] = role?.id;
                } else if(setting.type == "channel") {
                    const channel = ctx.guild?.channels.find(c => c.name == content);
                    if(!channel) {
                        msg.edit(SuccessEmbed("Channel not found.", "No changes were made.\nMake sure you are entering the channel name, not the mention."));
                        arx.cancel();
                        return;
                    }
                    set[setting.field] = channel?.id;
                }
            }
            ctx.commandClient.db.collection("guildSettings").updateOne({
                guildId: ctx.guildId
            }, {
                $set: set
            }, {upsert: true});
            msg.edit(SuccessEmbed("✅ Changes saved."));
            arx.cancel();
        }).catch(() => {
            return;
        });
    }).catch(e => {
        message.deleteReactions();
        if(e == "No reaction was given in time.") {
            message.edit(SuccessEmbed("Config was closed due to inactivity.", "No changes were made."));
        }
        arx.cancel();
        am.cancel();
    });
};

export default base.command;