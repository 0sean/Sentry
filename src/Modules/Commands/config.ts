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

base.run = async (ctx) => {
    const message = await ctx.reply(SuccessEmbed("⚙️ Configure Sentry", undefined, [{name: "🛡️ Verify", value: "Configure Sentry's bot and VPN detection."}, {name: "👮 Moderator role", value: "Choose who gets moderator permissions in Sentry."}, {name: "👋 Join/leave messages", value: "Choose where join/leave messages are sent to."}], "Click the buttons below to select a setting."));
    await message.react("🛡️");
    await message.react("👮");
    await message.react("👋");
    await message.react("❌");
    const ar = await AwaitReaction(ctx, e => { return e?.messageId == message.id && (e?.reaction.emoji.toString() == "🛡️" || e?.reaction.emoji.toString() == "👮" || e?.reaction.emoji.toString() == "👋" || e?.reaction.emoji.toString() == "❌"); }, 600000);
    ar.promise.then(async (r) => {
        message.deleteReactions();
        const document = await ctx.commandClient.db.collection("guildSettings").findOne({
            guildId: ctx.guildId
        });
        if(r.emoji.toString() == "🛡️") {
            await message.react("❌");
            let msg: Message;
            if(!document.verify) {
                msg = await message.edit(SuccessEmbed("🛡️ Verify", "Verify is currently **off**.\nTo enable it, type the name of the role you want assigned to new members when they verify.\n[Click me to see how your roles should be set up - this is important!](https://notion.so/)", undefined, "To exit without saving, click the ❌ button below."));
            } else {
                const role = ctx.guild?.roles.find(r => r.id == document.verify);
                if(!role) {
                    msg = await message.edit(SuccessEmbed("🛡️ Verify", "Verify is currently **off** as its role has been deleted.\nTo re-enable it, type the name of the role you want assigned to new members when they verify.\n[Click me to see how your roles should be set up - this is important!](https://notion.so/)", undefined, "To exit without saving, click the ❌ button below."));
                } else {
                    msg = await message.edit(SuccessEmbed("🛡️ Verify", `Verify is currently **on** with role \`${role.name}\`.\nTo change the role it gives, type the name of the role you want it changed to.\n[Click me to see how your roles should be set up - this is important!](https://notion.so/)\nTo disable it, type \`off\`.`, undefined, "To exit without saving, click the ❌ button below."));
                }
            }
            const arc = await AwaitReaction(ctx, e => { return e?.messageId == msg.id && e.reaction.emoji.toString() == "❌"; }, 600000);
            const am = await AwaitMessage(ctx, () => { return true; });
            arc.promise.then(() => {
                msg.edit(SuccessEmbed("Exited config.", "No changes were made."));
                msg.deleteReactions();
                am.cancel();
            }).catch(e => {
                if(e == "No reaction was given in time.") {
                    msg.edit(SuccessEmbed("Config was closed due to inactivity.", "No changes were made."));
                }
                msg.deleteReactions();
                am.cancel();
            });
            am.promise.then(m => {
                m.delete();
                if(m.content.trim() == "off") {
                    ctx.commandClient.db.collection("guildSettings").updateOne({
                        guildId: ctx.guildId
                    }, {
                        $set: {
                            verify: ""
                        }
                    });
                    msg.edit(SuccessEmbed("✅ Changes saved."));
                } else {
                    const role = ctx.guild?.roles.find(r => r.name == m.content.trim());
                    if(!role) return m.edit(ErrorEmbed("No role found with that name."));
                    ctx.commandClient.db.collection("guildSettings").updateOne({
                        guildId: ctx.guildId
                    }, {
                        $set: {
                            verify: role.id
                        }
                    });
                    msg.edit(SuccessEmbed("✅ Changes saved."));
                }
            }).catch(() => {
                return;
            });
        } else if(r.emoji.toString() == "👮") {
            await message.react("❌");
            let msg: Message;
            if(!document.modRole) {
                msg = await message.edit(SuccessEmbed("👮 Moderator role", "There is currently *no moderator role*.\nTo set one, type the name of the role you want it set to.", undefined, "To exit without saving, click the ❌ button below."));
            } else {
                const role = ctx.guild?.roles.find(r => r.id == document.modRole);
                if(!role) {
                    msg = await message.edit(SuccessEmbed("👮 Moderator role", "There is currently *no moderator role*, as the previous role was deleted.\nTo set one, type the name of the role you want it set to.", undefined, "To exit without saving, click the ❌ button below."));
                } else {
                    msg = await message.edit(SuccessEmbed("👮 Moderator role", `The moderator role is currently \`${role.name}\`.\nTo change it, type the name of the role you want it set to.\nTo disable it, type \`off\`.`, undefined, "To exit without saving, click the ❌ button below."));
                }
            }
            const arc = await AwaitReaction(ctx, e => { return e?.messageId == msg.id && e.reaction.emoji.toString() == "❌"; }, 600000);
            const am = await AwaitMessage(ctx, () => { return true; });
            arc.promise.then(() => {
                msg.edit(SuccessEmbed("Exited config.", "No changes were made."));
                msg.deleteReactions();
                am.cancel();
            }).catch(e => {
                if(e == "No reaction was given in time.") {
                    msg.edit(SuccessEmbed("Config was closed due to inactivity.", "No changes were made."));
                }
                msg.deleteReactions();
                am.cancel();
            });
            am.promise.then(m => {
                m.delete();
                if(m.content.trim() == "off") {
                    ctx.commandClient.db.collection("guildSettings").updateOne({
                        guildId: ctx.guildId
                    }, {
                        $set: {
                            modRole: ""
                        }
                    });
                    msg.edit(SuccessEmbed("✅ Changes saved."));
                } else {
                    const role = ctx.guild?.roles.find(r => r.name == m.content.trim());
                    if(!role) return m.edit(ErrorEmbed("No role found with that name."));
                    ctx.commandClient.db.collection("guildSettings").updateOne({
                        guildId: ctx.guildId
                    }, {
                        $set: {
                            modRole: role.id
                        }
                    });
                    msg.edit(SuccessEmbed("✅ Changes saved."));
                }
            }).catch(() => {
                return;
            });
        } else if(r.emoji.toString() == "👋") {
            await message.react("❌");
            let msg: Message;
            if(!document.joinLeaveMessages) {
                msg = await message.edit(SuccessEmbed("👋 Join/leave messages", "There is currently *no channel set*.\nTo set one, type the name of the channel you want join/leave messages sent to.", undefined, "To exit without saving, click the ❌ button below."));
            } else {
                const channel = ctx.guild?.channels.find(c => c.id == document.joinLeaveMessages);
                if(!channel) {
                    msg = await message.edit(SuccessEmbed("👋 Join/leave messages", "There is currently *no channel set*, as the previous one was deleted.\nTo set one, type the name of the channel you want join/leave messages sent to.", undefined, "To exit without saving, click the ❌ button below."));
                } else {
                    msg = await message.edit(SuccessEmbed("👋 Join/leave messages", `Join/leave messages are currently being sent to #${channel.name}.\nTo change it, type the name of the channel you want join/leave messages sent to. To disable them, type \`off\`.`, undefined, "To exit without saving, click the ❌ button below."));
                }
            }
            const arc = await AwaitReaction(ctx, e => { return e?.messageId == msg.id && e.reaction.emoji.toString() == "❌"; }, 600000);
            const am = await AwaitMessage(ctx, () => { return true; });
            arc.promise.then(() => {
                msg.edit(SuccessEmbed("Exited config.", "No changes were made."));
                msg.deleteReactions();
                am.cancel();
            }).catch(e => {
                if(e == "No reaction was given in time.") {
                    msg.edit(SuccessEmbed("Config was closed due to inactivity.", "No changes were made."));
                }
                msg.deleteReactions();
                am.cancel();
            });
            am.promise.then(m => {
                m.delete();
                if(m.content.trim() == "off") {
                    ctx.commandClient.db.collection("guildSettings").updateOne({
                        guildId: ctx.guildId
                    }, {
                        $set: {
                            joinLeaveMessages: ""
                        }
                    });
                    msg.edit(SuccessEmbed("✅ Changes saved."));
                } else {
                    const channel = ctx.guild?.channels.find(r => r.name == m.content.trim());
                    if(channel?.name.startsWith("<#")) return m.edit(ErrorEmbed("Send the channel name, not the mention."));
                    if(!channel) return m.edit(ErrorEmbed("No channel found with that name."));
                    ctx.commandClient.db.collection("guildSettings").updateOne({
                        guildId: ctx.guildId
                    }, {
                        $set: {
                            joinLeaveMessages: channel.id
                        }
                    });
                    msg.edit(SuccessEmbed("✅ Changes saved."));
                }
            }).catch(() => {
                return;
            });
        } else if(r.emoji.toString() == "❌") {
            message.edit(SuccessEmbed("Exited config.", "No changes were made."));
        }
    }).catch(e => {
        if(e == "No reaction was given in time.") {
            message.deleteReactions();
            message.edit(SuccessEmbed("Config was closed due to inactivity.", "No changes were made."));
        }
    });
};

export default base.command;