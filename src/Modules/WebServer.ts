import express from "express";
import signale from "signale";
import { Client } from "./Client";
import ip from "request-ip";
import got from "got";
import path from "path";
import { ErrorEmbed, SuccessEmbed } from "./Embeds";
import { Guild } from "detritus-client/lib/structures";
import { ClusterClient } from "detritus-client";

// TODO: Add more detail to these
interface VPNResponse {
    is_hosting: number
}

interface HCaptchaResponse {
    success: boolean
    "error-codes"?: string
}

export class WebServer {
    app: express.Application

    constructor(client: Client) {
        this.app = express();
        const port = process.env.WEB_PORT || 8080;
        this.app.use(ip.mw());
        this.app.use(express.urlencoded({
            extended: true
        }));
        this.app.use("/assets", express.static(path.join(__dirname, "../Web/Assets")));
        this.app.set("view engine", "ejs");
        this.app.set("views", path.join(__dirname, "../Web/Views"));

        this.app.get("/:verifyId", async (req, res) => {
            let guilds: Guild[] = [];
            (client.client as ClusterClient).shards.forEach(shard => {
                guilds = guilds.concat(shard.guilds.toArray());
            });
            const document = await client.db.collection("verification").findOne({
                verifyId: req.params.verifyId
            });
            if(!document) return res.render("Pages/404");
            const ip: VPNResponse = await got.get(`https://ip.teoh.io/api/vpn/${req.clientIp}`).json();
            if(ip.is_hosting == 0) {
                res.render("Pages/Captcha", {sitekey: process.env.HCAPTCHA_SITEKEY});
            } else {
                res.render("Pages/Failure");
                const document = await client.db.collection("verification").findOneAndDelete({
                        verifyId: req.params.verifyId
                    }), member = guilds.find(g => g.id == document.value.guildId)?.members.find(m => m.id == document.value.memberId);
                (await member?.createOrGetDm())?.createMessage(ErrorEmbed("You failed verification and were kicked from the server."));
                member?.remove({reason: "Sentry Verify: Member failed verification"});
            }
        });

        this.app.post("/:verifyId", async (req, res) => {
            let guilds: Guild[] = [];
            (client.client as ClusterClient).shards.forEach(shard => {
                guilds = guilds.concat(shard.guilds.toArray());
            });
            const h: HCaptchaResponse = await got.post("https://hcaptcha.com/siteverify", {
                form: {
                    secret: process.env.HCAPTCHA_SECRET,
                    response: req.body["h-captcha-response"],
                    remoteip: req.clientIp,
                    sitekey: process.env.HCAPTCHA_SITEKEY
                }
            }).json();
            if(h.success) {
                const document = await client.db.collection("verification").findOneAndDelete({
                        verifyId: req.params.verifyId
                    }), guild = guilds.find(g => g.id == document.value.guildId)
                    , member = guild?.members.find(m => m.id == document.value.memberId)
                    , guildDoc = await client.db.collection("guildSettings").findOne({
                        guildId: document.value.guildId
                    });
                res.render("Pages/Success", {guildName: guild?.name});
                (await member?.createOrGetDm())?.createMessage(SuccessEmbed(`✅ You passed verification. You can now chat in ${guild?.name}`));
                member?.addRole(guildDoc.verify, {reason: "Sentry Verify: Member passed verification"});
            } else {
                res.render("Pages/Failure");
                const document = await client.db.collection("verification").findOneAndDelete({
                        verifyId: req.params.verifyId
                    }), member = guilds.find(g => g.id == document.value.guildId)?.members.find(m => m.id == document.value.memberId);
                (await member?.createOrGetDm())?.createMessage(ErrorEmbed("You failed verification and were kicked from the server."));
                member?.remove({reason: "Sentry Verify: Member failed verification"});
            }
        });

        // 404 route - always keep this as the last route!
        this.app.get("*", (req, res) => {
            res.status(404).render("Pages/404");
        });

        this.app.listen(port, () => {
            signale.success(`Started web server on port ${port}`);
        });
    }
}