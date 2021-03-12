import { config } from "dotenv";
import { Bot } from "./Modules/Bot";

config();

new Bot();