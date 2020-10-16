import * as z from "zod";

export const RoleType = z.string().regex(/\b(admin|moderator|off)/gm);

const Role = z.object({
    id: z.string(),
    type: RoleType
});

export const ChannelType = z.string().regex(/\b(logs|joinleave)/gm);

const Channel = z.object({
    id: z.string(),
    // TODO: Add more channel types when known
    type: ChannelType
});

const Punishment = z.object({
    id: z.string().length(7),
    type: z.string().regex(/\b(strike|ban|kick|mute)/gm),
    reason: z.string(),
    automated: z.boolean(),
    subject: z.string(),
    actor: z.string()
});

export const LogType = z.string().regex(/\b(striked|banned)/gm);

export const Guild = z.object({
    id: z.string(),
    roles: z.array(z.record(Role)),
    channels: z.array(z.record(Channel)),
    // TODO: Regex this when log types are known
    logs: z.array(LogType),
    punishments: z.array(z.record(Punishment))
});

export type GuildType = z.infer<typeof Guild>
export type RoleType = z.infer<typeof Role>
export type ChannelType = z.infer<typeof Channel>
export type PunishmentType = z.infer<typeof Punishment>