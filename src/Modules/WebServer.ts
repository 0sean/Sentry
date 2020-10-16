import express from "express";
import signale from "signale";
import { Client } from "./Client";
import ip from "request-ip";
import got from "got";
import path from "path";

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
            const document = await client.db.collection("verification").findOne({
                verifyId: req.params.verifyId
            });
            if(!document) return res.render("Pages/404");
            const ip: VPNResponse = await got.get(`https://ip.teoh.io/api/vpn/${req.clientIp}`).json();
            if(ip.is_hosting == 0) {
                res.render("Pages/Captcha", {sitekey: process.env.HCAPTCHA_SITEKEY});
            } else {
                res.render("Pages/Failure");
                client.db.collection("verification").deleteOne({
                    verifyId: req.params.verifyId
                });
            }
        });

        this.app.post("/:verifyId", async (req, res) => {
            const h: HCaptchaResponse = await got.post("https://hcaptcha.com/siteverify", {
                form: {
                    secret: process.env.HCAPTCHA_SECRET,
                    response: req.body["h-captcha-response"],
                    remoteip: req.clientIp,
                    sitekey: process.env.HCAPTCHA_SITEKEY
                }
            }).json();
            if(h.success) {
                res.render("Pages/Success");
                client.db.collection("verification").deleteOne({
                    verifyId: req.params.verifyId
                });
            } else {
                res.render("Pages/Failure");
                client.db.collection("verification").deleteOne({
                    verifyId: req.params.verifyId
                });
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