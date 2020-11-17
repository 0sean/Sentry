import { Embed } from "detritus-client/lib/utils";
export function SuccessEmbed(title: string, description?: string, fields?: Array<Record<string, string>>, footer?: string, url?: string): Record<string, Embed> {
    const embed = new Embed();
    embed.setColor(0x00c853);
    embed.setTitle(title);
    if(url) { embed.setUrl(url); }
    if(description) { embed.setDescription(description); }
    if(fields) {
        for (let x = 0; x < fields.length; x++) {
            embed.addField(fields[x].name, fields[x].value, true);
        }
    }
    if(footer) { embed.setFooter(footer); }
    return {embed};
}

export function InProgressEmbed(title: string, description?: string, fields?: Array<Record<string, string>>, footer?: string, url?: string): Record<string, Embed> {
    const embed = new Embed();
    embed.setColor(0xff6d00);
    embed.setTitle(title);
    if(url) { embed.setUrl(url); }
    if(description) { embed.setDescription(description); }
    if(fields) {
        for (let x = 0; x < fields.length; x++) {
            embed.addField(fields[x].name, fields[x].value, true);
        }
    }
    if(footer) { embed.setFooter(footer); }
    return {embed};
}

export function ErrorEmbed(title: string, description?: string, fields?: Array<Record<string, string>>, footer?: string, url?: string): Record<string, Embed> {
    const embed = new Embed();
    embed.setColor(0xd50000);
    embed.setTitle("❌ Error: " + title);
    if(url) { embed.setUrl(url); }
    if(description) { embed.setDescription(description); }
    if(fields) {
        for (let x = 0; x < fields.length; x++) {
            embed.addField(fields[x].name, fields[x].value, true);
        }
    }
    if(footer) { embed.setFooter(footer); }
    return {embed};
}