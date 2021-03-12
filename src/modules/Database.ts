import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import signale from "signale";

const logger = signale.scope("Database");

export class Database {
    constructor() {
        logger.await("Connecting to MongoDB...");
        mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
        mongoose.connection.once("open", () => {
            logger.success("Connected to MongoDB.");
        });
    }
}

@modelOptions({schemaOptions: {collection: "punishments"}})
class PunishmentClass {
    @prop({required: true})
    public punishmentID!: string;

    @prop({required: true})
    public guildID!: string;

    @prop({required: true})
    public subjectID!: string;

    @prop({required: true})
    public actorID!: string;

    @prop({required: true})
    public type!: "strike" | "kick" | "ban" | "mute";

    @prop()
    public automated?: boolean = false;

    @prop()
    public reason?: string = "";
}

@modelOptions({schemaOptions: {collection: "verification"}})
class VerificationClass {
    @prop({required: true})
    public verificationID!: string;

    @prop({required: true})
    public guildID!: string;

    @prop({required: true})
    public memberID!: string;
}

@modelOptions({schemaOptions: {collection: "notes"}})
class NoteClass {
    @prop({required: true})
    public noteID!: string;

    @prop({required: true})
    public guildID!: string;

    @prop({required: true})
    public creatorID!: string;

    @prop({required: true})
    public noteContent!: string;
}

export const Punishment = getModelForClass(PunishmentClass);
export const Verification = getModelForClass(VerificationClass);
export const Note = getModelForClass(NoteClass);