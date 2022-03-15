/* eslint-disable no-unused-vars */
import { ClientEvents, Message, PermissionResolvable, ColorResolvable, EmojiIdentifierResolvable, User, Snowflake, GuildMember, TextChannel, MessageReaction, RoleResolvable, APIMessage, ApplicationCommandOptionData, CommandInteraction } from 'discord.js';
import { EventEmitter } from 'events';

import { GiveawayUtility } from '../bot';

export interface Command {
    /**
     * Name of the command.
     */
    name: string;
    /**
     * Aliases of the command.
     */
    aliases: string[];
    /**
     * The command's cooldown in seconds.
     */
    cooldown: number;
    /**
     * Description of the command.
     */
    description: string;
    /**
     * Does this command require any user permissions?
     */
    permissions?: PermissionResolvable[];
    /**
     * Does this command require any bot permissions?
     */
    clientPermissions?: PermissionResolvable[];
    /**
     * Does this command require any specific roles?
     */
    roles?: RoleResolvable[];
    /**
     * Can this command only be executed in a guild?
     */
    guildOnly?: boolean;
    /**
     * Can this command only be executed in a direct message?
     */
    dmOnly?: boolean;
    /**
     * Is this command only executable in a certain testing server?
     */
    testOnly?: boolean;
    /**
     * Is this command only executable by the bot owner?
     */
    ownerOnly?: boolean;
    /**
     * The actual stuff the command will perform.
     */
    execute: (message: Message, args?: string[], client?: GiveawayUtility) => Promise<Message | void>;
}

export interface SlashCommand {
    /**
     * Name of the slash command.
     */
    name: string;
    /**
     * The command description.
     */
    description: string;
    /**
     * Is the command global, or for a specific guild only?
     */
    global: boolean;
    /**
     * The slash command options.
     */
    options: ApplicationCommandOptionData[];
    /**
     * The actual stuff the command will do.
     */
    execute: (interaction: CommandInteraction, client?: GiveawayUtility) => Promise<APIMessage | Message | void>;
}

export interface EventHandler {
    /**
     * Name of event.
     */
    name: keyof ClientEvents;
    /**
     * Run only once?
     */
    once?: boolean;
    /**
     * Event callback
     * @this {this} `this` in the callback refers to the bot instance.
     */
    callback: <K extends keyof ClientEvents>(...args: ClientEvents[K]) => Promise<void>;
}