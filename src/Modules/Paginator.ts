import { Context } from "detritus-client/lib/command";
import { Message } from "detritus-client/lib/structures";
import { GatewayClientEvents } from "detritus-client/lib/gateway/clientevents";
import { SuccessEmbed, InProgressEmbed } from "./Embeds";

class ReactionListener {
    callback: (eventinfo: GatewayClientEvents.MessageReactionAdd) => void;

    constructor(paginator: Paginator, ctx: Context) {
        this.callback = async (eventinfo) => {
            const pmessage = await paginator.message;
            if(eventinfo.messageId != pmessage.id) return;
            if(eventinfo.member?.id == ctx.client.user?.id) return;
            if(eventinfo.member?.id != ctx.userId) return;
            if(eventinfo.reaction.emoji.toString() == "◀️") {
                paginator.previous();
            } else if (eventinfo.reaction.emoji.toString() == "▶️") {
                paginator.next();
            } else return;
            pmessage.deleteReaction(eventinfo.reaction.emoji.toString(), eventinfo.userId);
        };
        ctx.client.on("messageReactionAdd", this.callback);
        setTimeout(() => {
            this.stop(paginator, ctx);
        }, 600000);
    }

    async stop (paginator: Paginator, ctx: Context): Promise<void> {
        ctx.client.off("messageReactionAdd", this.callback);
        (await paginator.message).edit(InProgressEmbed(`The ${ctx.command?.name} window was closed.`, `After 10 minutes ${ctx.command?.name} windows are closed, as they probably aren't in use anymore.\nYou were still using it? Run \`${ctx.prefix}${ctx.command?.name}\` again.`));
        (await paginator.message).deleteReactions();
    }
}

export class Paginator {
    message: Promise<Message>
    page: number
    max: number
    title: string
    description?: string
    pages: Record<string, string>[][]
    listener: ReactionListener

    constructor(ctx: Context, pages: Record<string, string>[][], title: string, description?: string) {
        this.page = 0;
        this.max = pages.length - 1;
        this.title = title;
        this.description = description;
        this.pages = pages;
        this.message = ctx.reply(SuccessEmbed(this.title, this.description, pages[0], `Page 1/${this.max+1} | Use the buttons below to move between pages.`));
        (async (message) => {
            (await message).react("◀️").then(async () => {
                (await message).react("▶️");
            });  
        })(this.message);
        this.listener = new ReactionListener(this, ctx);
    }
    async next(): Promise<void> {
        if(this.page == this.max) {
            this.page = 0;
        } else {
            this.page++;
        }
        this.message = (await this.message).edit(SuccessEmbed(this.title, this.description, this.pages[this.page], `Page ${this.page+1}/${this.max+1} | Use the buttons below to move between pages.`));
    }
    async previous(): Promise<void> {
        if(this.page == 0) {
            this.page = this.max;
        } else {
            this.page = this.page - 1;
        }
        this.message = (await this.message).edit(SuccessEmbed(this.title, this.description, this.pages[this.page], `Page ${this.page+1}/${this.max+1} | Use the buttons below to move between pages.`));
    }
}