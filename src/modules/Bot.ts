import { NextServer } from "./NextServer";
import signale from "signale";
import { Client } from "discord.js-commando";
import path from "path";
import { MongoClient } from "mongodb";
import { MongoDBProvider } from "commando-provider-mongo";

const logger = signale.scope("Bot");

export class Bot {
    constructor() {
        logger.await("Starting bot...");
        
        const client = new Client({
            owner: process.env.DISCORD_OWNER_ID,
            commandPrefix: process.env.PREFIX,
            presence: {status: "dnd", activity: {name: "your servers.", type: "WATCHING"}}
        });

        client.registry
            .registerGroups([{id: "utility"}, {id: "moderation"}])
            .registerDefaultTypes()
            .registerCommandsIn(path.join(__dirname, "commands"));

        // TODO: Get DB name from url
        client.setProvider(
            MongoClient.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(m => new MongoDBProvider(m, "sentry"))
        ).catch(logger.error);

        client.once("ready", () => {
            logger.success("Running and connected to Discord.");
            DiscordClient = client;
            client.guilds.cache.forEach(g => g.members.fetch());
            new NextServer();
        });

        client.login(process.env.DISCORD_BOT_TOKEN);
    }
}

export let DiscordClient: Client | undefined;