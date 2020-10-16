import { GatewayClientEvents } from "detritus-client";
import { Message, Reaction } from "detritus-client/lib/structures";
import { Context } from "./Client";

export async function AwaitMessage(ctx: Context, filter: (m?: Message) => boolean, timeout?: number): Promise<{promise: Promise<Message>, cancel: () => void}> {
    let rejectOuter: (reason: unknown) => void;
    const promise = new Promise((resolve, reject) => {
        rejectOuter = reject;
        if(timeout) {
            // eslint-disable-next-line no-var
            var timer = setTimeout(() => {
                reject("No reply was given in time.");
            }, timeout);
        }
        const callback = (eventinfo: GatewayClientEvents.MessageCreate) => {
            if(eventinfo.message.author.id != ctx.message.author.id) return;
            if(filter(eventinfo.message)) {
                if(timeout) {
                    clearTimeout(timer);
                }
                ctx.client.off("messageCreate", callback);
                resolve(eventinfo.message);
            }
        };
        ctx.client.on("messageCreate", callback);
    });
    return {promise: promise as Promise<Message>, cancel: () => { rejectOuter("Cancelled"); }};
}

export async function AwaitReaction(ctx: Context, filter: (e?: GatewayClientEvents.MessageReactionAdd) => boolean, timeout?: number): Promise<{promise: Promise<Reaction>, cancel: () => void}> {
    let rejectOuter: (reason: unknown) => void;
    const promise = new Promise((resolve, reject) => {
        rejectOuter = reject;
        if(timeout) {
            // eslint-disable-next-line no-var
            var timer = setTimeout(() => {
                reject("No reaction was given in time.");
            }, timeout);
        }
        const callback = (eventinfo: GatewayClientEvents.MessageReactionAdd) => {
            if(eventinfo.member?.id != ctx.message.author.id) return;
            if(filter(eventinfo)) {
                if(timeout) {
                    clearTimeout(timer);
                }
                ctx.client.off("messageReactionAdd", callback);
                resolve(eventinfo.reaction);
            }
        };
        ctx.client.on("messageReactionAdd", callback);
    });
    return {promise: promise as Promise<Reaction>, cancel: () => { rejectOuter("Cancelled"); }};
}