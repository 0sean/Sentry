// This adds extra stuff to the client for easier command creation
import { CommandClient, CommandClientOptions } from "detritus-client/lib/commandclient";
import { MongoClient, Db } from "mongodb";
import signale from "signale";
import { GatewayClientEvents, ShardClient } from "detritus-client";
import { Context as DetritusContext } from "detritus-client/lib/command";
import { Events } from "./Events";

// TODO: Events incl log events and new server events for db

export class Client extends CommandClient {
    mongo!: MongoClient;
    db!: Db;

    async startDatabase(): Promise<void> {
        const client = new MongoClient(process.env.MONGO_URI as string, {
            appname: "Sentry",
            useUnifiedTopology: true
        });
        await client.connect();
        await client.db("admin").command({ping: 1});
        signale.success("Connected to Mongo.");
        this.mongo = client;
        this.db = client.db(process.env.MONGO_DBNAME);
    }

    constructor(token: ShardClient | string, options: CommandClientOptions) {
        super(token, options);
        this.startDatabase();
        Events.forEach(event => {
            this.client.addListener(event.name, (data: GatewayClientEvents.GuildMemberAdd) => {
                event.trigger(data, this);
            });
        });
    }
}

export class Context extends DetritusContext {
    commandClient!: Client
}