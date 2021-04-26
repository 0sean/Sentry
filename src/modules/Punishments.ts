import { DiscordClient } from "./Bot";
import crs from "crypto-random-string";

interface Punishment {
    type: "strike" | "kick" | "ban"
    reason: string
    actorID: string
    subjectID: string
    guildID: string
    punishmentID: string
    automated?: boolean;
}

export default class Punishments {
    constructor(guildID: string, memberID?: string) {
        this.guildID = guildID;
        this.memberID = memberID;
    }

    guildID: string
    memberID?: string

    getID(punishmentID?: string) {
        const punishments: Punishment[] = DiscordClient?.provider.get(this.guildID, "punishments") || [];

        return punishments.filter(p => p.punishmentID == punishmentID)[0];
    }

    getMember(memberID?: string) {
        const punishments: Punishment[] = DiscordClient?.provider.get(this.guildID, "punishments") || [];

        return punishments.filter(p => p.subjectID == memberID);
    }

    add(punishment: Omit<Punishment, "punishmentID" | "guildID">) {
        const punishments: Punishment[] = DiscordClient?.provider.get(this.guildID, "punishments") || [],
            p = punishment as Punishment;

        p.punishmentID = crs({length: 7});
        p.guildID = this.guildID;
        punishments.push(p);

        DiscordClient?.provider.set(this.guildID, "punishments", punishments);

        return p.punishmentID;
    }
}