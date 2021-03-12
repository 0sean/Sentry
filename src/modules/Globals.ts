import { CommandClient } from "detritus-client";

export default new class Globals {
    private _commandClient?: CommandClient;

    public get commandClient() {
        return this._commandClient;
    }

    public set commandClient(cc: CommandClient | undefined) {
        this._commandClient = cc;
    }
};