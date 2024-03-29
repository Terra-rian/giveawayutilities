import { Message, Collection, EmbedBuilder, TextChannel, Events } from 'discord.js';
import moment from 'moment';

import { prefix, owner_id, owner_guild_id, error_channel_id } from '../assets/config.json';
import { createError, parseCase } from '../assets/functions';
import { Command, EventHandler } from '../typings/types';
import { GiveawayUtility } from '../bot';

export = {
    name: Events.MessageCreate,
    once: false,
    callback: async function(message: Message) {
        const self = this as unknown as GiveawayUtility;

        if(!self.application?.owner) {
            await self.application?.fetch();
        }

        if(message.author.bot || message.webhookId) {
            return;
        }

        if(!message.content.startsWith(prefix)) {
            return;
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command_name = args.shift()?.toLowerCase();

        if(!command_name || command_name.length === 0) {
            return;
        }

        const command: Command | undefined = self.commands.get(command_name) || self.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command_name));
        if(!command) {
            return;
        }

        if(command.guildOnly && !message.guild) {
            return message.reply(`The command \`${command.name}\` is only usable within a server.`);
        }

        if(command.dmOnly && message.guild) {
            return message.reply(`The command \`${command.name}\` is only usable within DMs.`);
        }

        if(command.testOnly && message.guild?.id !== owner_guild_id) {
            return message.reply(`The command \`${command.name}\` is only usable in the bot dev's testing server.`);
        }

        if(command.ownerOnly && message.author.id !== owner_id) {
            return message.reply(`The command \`${command.name}\` is only available to the bot developer.`);
        }

        let has_permissions = true;
        if(message.guild && command.permissions) {
            for(const permission of command.permissions) {
                if(!message.member?.permissions.has(permission, true)) {
                    has_permissions = false;
                    break;
                }
            }
        }

        if(!has_permissions) {
            return message.reply(('You need to have the `$PERMS` permission(s) to run this command.').replace(/\$PERMS/g, `\`${command.permissions?.map((permission) => parseCase(permission.toString())).join(', ')}\``));
        }

        let has_roles = true;
        if(command.roles) {
            for(const role of command.roles) {
                if(!message.member?.roles.cache.has(role.toString()) && !message.member?.permissions.has('Administrator', true)) {
                    has_roles = false;
                    break;
                }
            }
        }

        if(!has_roles) {
            return message.reply({ content: `You need to have at least the <@&${command.roles?.map((role) => parseCase(role.toString())).join('>, <@&')}> role(s) to run this command.`, allowedMentions: { parse: [] } });
        }

        if(!self.cooldowns.has(command.name)) {
            self.cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = self.cooldowns.get(command.name);
        const cooldown_amount = command.cooldown * 1000;

        if(timestamps && timestamps.has(message.author.id)) {
            const expiration_time = (timestamps.get(message.author.id) ?? 0) + cooldown_amount;

            if(now < expiration_time) {
                const time_left = (expiration_time - now) / 1000;
                return message.reply(`please wait ${time_left.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps?.set(message.author.id, now);
        setTimeout(() => timestamps?.delete(message.author.id), cooldown_amount);

        try {
            await command.execute(message, args, self);
        } catch(error) {
            message.reply({ embeds: [createError(`An error occured while executing that command.\n\`${error as Error}\``)] });

            const date = new Date();
            const embed = new EmbedBuilder()
                .setTitle(`${(error as Error).message}`)
                .setDescription(`Time: \`${moment(date).format('HH:mm:ss DD/MM/YYYY')}\`\nServer ID: \`${message.guild?.id}\`\nChannel ID: \`${message.channel.id}\`\nUser ID: \`${message.author.id}\`\n\`\`\`\n${(error as Error).stack as string}\n\`\`\``)
                .setColor('Random')
                .setTimestamp();

            const channel = message.client.channels.cache.get(error_channel_id);
            try {
                const webhooks = await (channel as TextChannel).fetchWebhooks();
                const webhook = webhooks.first();

                await webhook?.send({
                    username: 'Errors',
                    embeds: [embed],
                });
            } catch(err) {
                console.error(`Error trying to send to Error Webhook: ${err}`);
            }

            return console.log(error);
        }
    },
} as EventHandler;