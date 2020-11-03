// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ClusterClient } from "detritus-client";
import { PresenceStatuses, ActivityTypes } from "detritus-client/lib/constants";
import { Client } from "./Client";
import { WebServer } from "./WebServer";
import { ClientEvents } from "detritus-client/lib/constants";
import signale = require("signale");

export class Bot {
    constructor() {
        const token = process.env.DISCORD_TOKEN || "",
            prefix = process.env.DISCORD_PREFIX || "s!";
        const commandClient = new Client(token, {
            prefix
        });

        commandClient.addMultipleIn("./Modules/Commands");

        return (async () => {
            const client = await commandClient.run();
            new WebServer(commandClient);
            // TODO: Get custom status type to work
            (client as ClusterClient).shards.forEach(shard => {
                shard.gateway.setPresence({
                    activity: {
                        name: "your servers.",
                        type: ActivityTypes.WATCHING
                    },
                    status: PresenceStatuses.DND
                });
            });
            signale.success("Running and connected to Discord.");
            return client;
        })();
    }
}