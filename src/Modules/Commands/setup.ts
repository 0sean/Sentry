import { Context } from "../Client";
import { SuccessEmbed, ErrorEmbed } from "../Embeds";
import { UnexpectedError } from "../UnexpectedError";
import { PS_GuildOwner } from "../Permissions";
import { GatewayClientEvents } from "detritus-client/lib/gateway/clientevents";
import { AwaitMessage, AwaitReaction } from "../Awaiters";

export const command = {
    name: "setup",
    metadata: {
        description: "Setup Sentry for your server.",
        permissions: PS_GuildOwner 
    },
    onBefore: PS_GuildOwner.identify,
    onRunError: UnexpectedError,
    run: async (ctx: Context): Promise<void> => {
        const message = await ctx.reply(SuccessEmbed("🛠️ Server setup", undefined, [{name: "🛡️ Verify", value: "Enable/disable Verify, our VPN and bot detection system."}, {name: "👮 Moderator role", value: "Change who gets moderator permissions."}, {name: "👋 Join/leave messages", value: "Enable/disable join/leave messages."}], "Use the buttons below to select an option."));
        await message.react("🛡️");
        await message.react("👮");
        await message.react("👋");
        await message.react("❌");
        const callback = async (eventinfo: GatewayClientEvents.MessageReactionAdd) => {
            if(eventinfo.messageId != message.id) return;
            if(eventinfo.member?.id == ctx.client.user?.id) return;
            if(eventinfo.member?.id != ctx.userId) return;
            if(eventinfo.reaction.emoji.toString() == "🛡️") {
                const document = await ctx.commandClient.db.collection("guildSettings").findOne({
                        guildId: ctx.guildId
                    }), role = ctx.guild?.roles.find(r => r.id == document.verify);
                if(!document.verify) {
                    // TODO: Make documentation for this
                    message.edit(SuccessEmbed("🛡️ Verify", "Verify is currently disabled.\n\n**To enable Verify, type the name of the role you want assigned when members get verified.**\n[Click me to see how your roles should be set up - this is important!](https://telegra.ph/Placeholder-page-10-10).", undefined, "Click the ❌ button below to cancel."));
                } else {
                    message.edit(SuccessEmbed("🛡️ Verify", `Verify is currently enabled with verified role \`${role?.name || "Deleted role"}\`.\n\n**To change the role assigned when members get verified, type the name of the role. To disable Verify, type \`none\`.**\n[Click me to see how your roles should be set up - this is important!](https://telegra.ph/Placeholder-page-10-10)`, undefined, "Click the ❌ button below to cancel."));
                }
                const am = await AwaitMessage(ctx, m => { return m?.member?.id == ctx.member?.id; }, 600000);
                const ar = await AwaitReaction(ctx, r => { return r?.reaction.emoji.toString() == "❌" && r.messageId == message.id && r.member?.id == ctx.member?.id; });
                am.promise.then(result => {
                    result.delete();
                    if(result.content.trim() == "none") {
                        ctx.commandClient.db.collection("guildSettings").updateOne({guildId: ctx.guildId}, {
                            $set: {
                                verify: ""
                            }
                        });
                        message.edit(SuccessEmbed("✅ Settings updated."));
                    } else {
                        const newrole = ctx.guild?.roles.find(r => r.name == result.content.trim());
                        if(!newrole) {
                            message.edit(ErrorEmbed("No role with this name exists"));
                        } else {
                            ctx.commandClient.db.collection("guildSettings").updateOne({guildId: ctx.guildId}, {
                                $set: {
                                    verify: newrole?.id
                                }
                            });
                            message.edit(SuccessEmbed("✅ Settings updated."));
                        }
                    }
                    message.deleteReactions();
                    ar.cancel();
                }).catch((reason: string) => {
                    if (reason == "Cancelled") return;
                    message.edit(ErrorEmbed(reason));
                    ar.cancel();
                });
                ar.promise.then(() => {
                    message.edit(SuccessEmbed("Setup closed."));
                    message.deleteReactions();
                    am.cancel();
                }).catch((reason: string) => {
                    if (reason == "Cancelled") return;
                    message.edit(ErrorEmbed(reason));
                });
            } else if(eventinfo.reaction.emoji.toString() == "👮") {
                const document = await ctx.commandClient.db.collection("guildSettings").findOne({
                        guildId: ctx.guildId
                    }), role = ctx.guild?.roles.find(r => r.id == document.modrole);
                if(!document.modrole) {
                    message.edit(SuccessEmbed("👮 Moderator role", "You don't have a moderator role set.\n\n**To change the role, type the name of the role you want it changed to.**", undefined, "Click the ❌ button below to cancel."));
                } else {
                    message.edit(SuccessEmbed("👮 Moderator role", `Your current moderator role is \`${role?.name || "Deleted Role"}\`.\n\n**To change the role, type the name of the role you want it changed to, or \`none\` to disable it.**`, undefined, "Click the ❌ button below to cancel."));
                }
                const am = await AwaitMessage(ctx, m => { return m?.member?.id == ctx.member?.id; }, 600000);
                const ar = await AwaitReaction(ctx, r => { return r?.reaction.emoji.toString() == "❌" && r.messageId == message.id && r.member?.id == ctx.member?.id; });
                am.promise.then(result => {
                    result.delete();
                    if(result.content.trim() == "none") {
                        ctx.commandClient.db.collection("guildSettings").updateOne({guildId: ctx.guildId}, {
                            $set: {
                                modrole: ""
                            }
                        });
                        message.edit(SuccessEmbed("✅ Settings updated."));
                    } else {
                        const newrole = ctx.guild?.roles.find(r => r.name == result.content.trim());
                        if(!newrole) {
                            message.edit(ErrorEmbed("No role with this name exists"));
                        } else {
                            ctx.commandClient.db.collection("guildSettings").updateOne({guildId: ctx.guildId}, {
                                $set: {
                                    modrole: newrole?.id
                                }
                            });
                            message.edit(SuccessEmbed("✅ Settings updated."));
                        }
                    }
                    message.deleteReactions();
                    ar.cancel();
                }).catch((reason: string) => {
                    if(reason == "Cancelled") return;
                    message.edit(ErrorEmbed(reason));
                    ar.cancel();
                });
                ar.promise.then(() => {
                    message.edit(SuccessEmbed("Setup closed."));
                    message.deleteReactions();
                    am.cancel();
                }).catch((reason: string) => {
                    if(reason == "Cancelled") return;
                    message.edit(ErrorEmbed(reason));
                });
            } else if(eventinfo.reaction.emoji.toString() == "👋") {
                const document = await ctx.commandClient.db.collection("guildSettings").findOne({
                        guildId: ctx.guildId
                    }), channel = ctx.guild?.channels.find(c => c.id == document.joinLeaveMessages);
                if(!document.joinLeaveMessages) {
                    message.edit(SuccessEmbed("👋 Join/leave messages", "Join/leave messages are currently disabled.\n\n**To enable them, type the name of the channel you want them sent to.**", undefined, "Click the ❌ button below to cancel."));
                } else {
                    message.edit(SuccessEmbed("👋 Join/leave messages", `Your join/leave messages are being sent to \`#${channel?.name || "Deleted channel"}\`.\n\n**To disable them, type \`none\`**\n**To change them, type the name of the channel you want them sent to.**`, undefined, "Click the ❌ button below to cancel."));
                }
                const am = await AwaitMessage(ctx, m => { return m?.member?.id == ctx.member?.id; }, 600000);
                const ar = await AwaitReaction(ctx, r => { return r?.reaction.emoji.toString() == "❌" && r.messageId == message.id && r.member?.id == ctx.member?.id; });
                am.promise.then(result => {
                    result.delete();
                    if(result.content.trim() == "none") {
                        ctx.commandClient.db.collection("guildSettings").updateOne({guildId: ctx.guildId}, {
                            $set: {
                                joinLeaveMessages: ""
                            }
                        });
                        message.edit(SuccessEmbed("✅ Settings updated."));
                    } else {
                        const newchannel = ctx.guild?.channels.find(c => c.name == result.content.trim());
                        if(!newchannel) {
                            message.edit(ErrorEmbed("No channel with this name exists"));
                        } else {
                            ctx.commandClient.db.collection("guildSettings").updateOne({guildId: ctx.guildId}, {
                                $set: {
                                    joinLeaveMessages: newchannel?.id
                                }
                            });
                            message.edit(SuccessEmbed("✅ Settings updated."));
                        }
                    }
                    message.deleteReactions();
                    ar.cancel();
                }).catch((reason: string) => {
                    if(reason == "Cancelled") return;
                    message.edit(ErrorEmbed(reason));
                    ar.cancel();
                });
                ar.promise.then(() => {
                    message.edit(SuccessEmbed("Setup closed."));
                    message.deleteReactions();
                    am.cancel();
                }).catch((reason: string) => {
                    if(reason == "Cancelled") return;
                    message.edit(ErrorEmbed(reason));
                });
            } else if(eventinfo.reaction.emoji.toString() == "❌") {
                message.edit(SuccessEmbed("Setup closed."));
                message.deleteReaction("❌", ctx.userId);
            } else return;
            message.deleteReaction(eventinfo.reaction.emoji.toString(), ctx.member?.id);
            message.deleteReaction("🛡️");
            message.deleteReaction("👮");
            message.deleteReaction("👋");
            ctx.client.off("messageReactionAdd", callback);
        };
        ctx.client.on("messageReactionAdd", callback);
    }
};

export default command;