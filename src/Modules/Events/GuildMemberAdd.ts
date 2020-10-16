import { GatewayRawEvents } from "detritus-client";
import { ClientEvents } from "detritus-client/lib/constants";
export const GuildMemberAdd = {
    name: ClientEvents.GUILD_MEMBER_ADD,
    async trigger(data?: GatewayRawEvents.GuildMemberAdd): Promise<void> {
        console.log("Guildmemberadd");
    }
};