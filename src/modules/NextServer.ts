import Express, { json } from "express";
import next from "next";
import signale from "signale";
import passport from "passport";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { Strategy } from "passport-discord";
import { DiscordClient } from "./Bot";
import session from "express-session";
import Unprotected from "./api/unprotected";
import Protected from "./api/protected";

const logger = signale.scope("NextServer");

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
}

function isAuthenticatedAPI(req: Request, res: Response, next: NextFunction) {
    if(req.isAuthenticated()) return next();
    res.status(401);
    res.send({error: "Unauthorized."});
}

export class NextServer {
    constructor() {
        logger.await("Starting NextServer...");

        const express = Express(),
            app = next({dir: "./web", dev: process.env.NEXTSERVER_DEV == "true"}),
            handle = app.getRequestHandler();

        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((obj: globalThis.Express.User, done) => {
            done(null, obj);
        });

        passport.use(new Strategy({
            clientID: DiscordClient?.user?.id || "",
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.WEB_DOMAIN + "callback",
            scope: ["identify"],
            passReqToCallback: true
        }, (req, accessToken, refreshToken, profile, done) => {
            process.nextTick(() => { return done(null, profile); });
        }));

        express.use(session({
            secret: process.env.SESSION_SECRET,
            resave: true,
            saveUninitialized: true
        }));
        express.use(passport.initialize());
        express.use(passport.session());
        express.use(json());

        app.prepare().then(() => {

            express.get("/login", passport.authenticate("discord"));

            express.get("/callback", passport.authenticate("discord", {failureRedirect: "/"}), (req, res) => {
                res.redirect("/dashboard");
            });

            express.get("/logout", (req, res) => {
                req.logout();
                res.redirect("/");
            });

            express.get("/dashboard", isAuthenticated, (req, res) => {
                handle(req, res);
            });

            Protected.forEach(route => {
                if(route.method == "POST") {
                    express.post(`/api/${route.name}`, isAuthenticatedAPI, route.callback);
                } else {
                    express.get(`/api/${route.name}`, isAuthenticatedAPI, route.callback);
                }
            });

            Unprotected.forEach(router => {
                express.use("/api", router);
            });
    
            express.get("*", (req, res) => {
                handle(req, res);
            });
    
            express.listen(Number(process.env.WEB_PORT), () => {
                logger.success(`Listening on port ${process.env.WEB_PORT}`);
            });
        });
    }
}