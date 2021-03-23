import { config } from "dotenv";
import { Bot } from "./modules/Bot";

config();

new Bot();