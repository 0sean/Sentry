import { createServer } from "http";
import { parse } from "url";
import next from "next";
import signale from "signale";

const logger = signale.scope("NextServer");

export class NextServer {
    constructor() {
        logger.await("Starting NextServer...");

        const app = next({dir: "./web"}),
            handle = app.getRequestHandler();

        app.prepare().then(() => {
            createServer((req, res) => {
                const parsed = parse(req.url || "", true);

                handle(req, res, parsed);
            }).listen(Number(process.env.WEB_PORT), () => {
                logger.success(`Listening on port ${process.env.WEB_PORT}.`);
            });
        });
    }
}