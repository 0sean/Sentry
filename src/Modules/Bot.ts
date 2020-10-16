// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ClusterClient } from "detritus-client";
import { PresenceStatuses, ActivityTypes } from "detritus-client/lib/constants";
import { Client, Event } from "./Client";
import { WebServer } from "./WebServer";
import { Events } from "./Events";
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
            commandClient.startDatabase();
            const client = await commandClient.run();
            new WebServer(commandClient);
            Events.forEach((event: Event) => {
                commandClient.client.addListener(event.name, event.trigger);
            });
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