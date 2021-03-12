import { GatewayClientEvents, ShardClient } from "detritus-client";
import { ClientEvents } from "detritus-client/lib/constants";
import { Client } from "../Client";
import random from "crypto-random-string";
import { InProgressEmbed } from "../Embeds";

export const GuildMemberAdd = {
    name: ClientEvents.GUILD_MEMBER_ADD,
    
    async trigger(data: GatewayClientEvents.GuildMemberAdd, client: Client): Promise<void> {
        const guildDoc = await client.db.collection("guildSettings").findOne({
                guildId: data.guildId
            }), dataRecord = data as unknown as Record<string, unknown>
            , shard = dataRecord.shard as ShardClient
            , guild = shard.guilds.find(g => g.id == data.guildId);

        if(!guildDoc) {
            client.db.collection("guildSettings").insertOne({
                guildId: data.guildId,
                modRole: "",
                joinLeaveMessages: "",
                verify: ""
            });
            return;
        }

        if(guildDoc.verify == "") return;
        if(!guild?.roles.has(guildDoc.verify)) return;

        const id = random({length: 7});
        client.db.collection("verification").insertOne({
            guildId: data.guildId,
            memberId: data.member.id,
            verifyId: id
        });
        const embed = InProgressEmbed(`🛡️ To chat in ${guild?.name}, click me.`, undefined, undefined, undefined, `https://${process.env.WEB_DOMAIN}/${id}`);
        (await data.member.createOrGetDm()).createMessage(embed);
    }
};