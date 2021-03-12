import { CommandClient, ClusterClient } from "detritus-client";
import { ActivityTypes, PresenceStatuses } from "detritus-client/lib/constants";
import Events from "./events";
import { NextServer } from "./NextServer";
import { Database } from "./Database";
import Globals from "./Globals";
import signale from "signale";

const logger = signale.scope("Bot");

export class Bot {
    constructor() {
        logger.await("Starting bot...");

        const commandClient = new CommandClient(process.env.DISCORD_BOT_TOKEN, {
            prefix: process.env.PREFIX
        });

        commandClient.addMultipleIn("./modules/commands");

        // TODO: Add automatically from folder?
        Events.forEach(event => {
            commandClient.client.addListener(event.name, data => {
                event.trigger(data, commandClient);
            });
        });

        Globals.commandClient = commandClient;

        (async () => {
            const client = await commandClient.run(); // TODO: consider type asserting this as ClusterClient here?
            
            new NextServer();
            new Database();

            (client as ClusterClient).shards.forEach(shard => {
                shard.gateway.setPresence({
                    activity: {
                        name: "your servers.",
                        type: ActivityTypes.WATCHING
                    },
                    status: PresenceStatuses.DND
                });
            });

            logger.success("Running and connected to Discord.");
        })();
    }
}