import { Embed as DetritusEmbed } from "detritus-client/lib/utils";

enum EmbedColors {
    error = 0xff0000,
    inprogress = 0xff6d00,
    success = 0x00ff00,
    info = 0x0000ff
}

export function Embed(embedData: {type: "none" | "error" | "inprogress" | "success" | "info", title: string, description?: string, fields?: {name: string, value: string}[], footer?: string, url?: string}) {
    const e = new DetritusEmbed();
    if(embedData.type != "none") {
        e.setColor(EmbedColors[embedData.type]);
    }
    if(embedData.type == "error") {
        e.setTitle(`❌ Error: ${embedData.title}`);
    } else {
        e.setTitle(embedData.title);
    }
    e.setDescription(embedData.description || "");
    if(embedData.fields) {
        for (let i = 0; i < embedData.fields.length; i++) {
            e.addField(embedData.fields[i].name, embedData.fields[i].value, true);
        }
    }
    e.setFooter(embedData.footer || "");
    e.setUrl(embedData.url || "");
    return {embed: e};
}