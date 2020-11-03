// This adds extra stuff to the client for easier command creation
import { CommandClient, CommandClientOptions } from "detritus-client/lib/commandclient";
import { MongoClient, Db } from "mongodb";
import signale from "signale";
import { ShardClient } from "detritus-client";
import { Events } from "./Events";
import { Context as DetritusContext } from "detritus-client/lib/command";

// TODO: Events incl log events and new server events for db

export interface Event {
    name: string,
    trigger(data: unknown): void | Promise<void>
}

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
        Events.forEach((event: Event) => {
            this.client.addListener(event.name, event.trigger);
        });
    }
}

export class Context extends DetritusContext {
    commandClient!: Client
}