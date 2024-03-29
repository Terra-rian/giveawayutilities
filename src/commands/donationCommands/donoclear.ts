import { ButtonInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType } from 'discord.js';

import { createError } from '../../assets/functions';
import { donations } from '../../models/donations';
import { Command } from '../../typings/types';

export = {
    name: 'donoclear',
    description: 'Clears the stats of a mentioned user, or the entire server. USE WITH CAUTION!!!',
    aliases: ['clear', 'donationclear', 'wipe'],
    cooldown: 3,
    guildOnly: true,
    permissions: ['Administrator'],
    execute: async (message, args) => {
        let target;

        if(message.guild && message.mentions.members?.first()) {
            target = message.mentions.members.first();
        } else if(message.guild && !message.mentions.members?.first() && args && args[0] !== 'server') {
            target = message.guild.members.cache.get(args[0]);
        } else {
            return message.reply({ embeds: [createError('Please specify either a user via ID or mention, or `server` to clear the entire server\'s stats (`server` option not implemented yet).\n\n⚠️⚠️⚠️ **THIS ACTION IS NOT REVERSIBLE! USE WITH CAUTION!** ⚠️⚠️⚠️')] });
        }

        if(!target) {
            return message.reply({ embeds: [createError('Please specify either a user via ID or mention, or `server` to clear the entire server\'s stats (`server` option not implemented yet).\n\n⚠️⚠️⚠️ **THIS ACTION IS NOT REVERSIBLE! USE WITH CAUTION!** ⚠️⚠️⚠️')] });
        }

        const confirmation_embed = new EmbedBuilder()
            .setTitle('⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️')
            .setDescription('Are you **sure** you want to proceed?\n\nThis command will wipe either the user you mentioned or the entire server\'s stats!')
            .setFooter({ text: `⚠️ Used by ${message.author.id} ⚠️` })
            .setColor('Yellow')
            .setTimestamp();

        const last_confirmation_embed = new EmbedBuilder()
            .setTitle('⚠️⚠️⚠️ FINAL WARNING ⚠️⚠️⚠️')
            .setDescription('Are you *absolutely* **sure** that you want to proceed?\n\nThis command will **wipe** either the user you mentioned or the entire server\'s stats!')
            .setFooter({ text: `⚠️ Used by ${message.author.id} ⚠️` })
            .setColor('Red')
            .setTimestamp();

        const first_confirmation_accept = new ButtonBuilder()
            .setCustomId('first-confirmation-accept')
            .setLabel('Proceed')
            .setStyle(ButtonStyle.Danger);
        const first_confirmation_deny = new ButtonBuilder()
            .setCustomId('first-confirmation-deny')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Success);

        const last_confirmation_accept = new ButtonBuilder()
            .setCustomId('last-confirmation-accept')
            .setLabel('Proceed')
            .setStyle(ButtonStyle.Danger);
        const last_confirmation_deny = new ButtonBuilder()
            .setCustomId('last-confirmation-deny')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Success);

        const first_confirmation_buttons = new ActionRowBuilder<ButtonBuilder>().addComponents([
            first_confirmation_accept,
            first_confirmation_deny,
        ]);
        const first_confirmation = message.reply({ embeds: [confirmation_embed], components: [first_confirmation_buttons] });

        const filter = (button: ButtonInteraction) => (button.customId === 'first-confirmation-accept' || button.customId === 'first-confirmation-deny') && button.user.id === message.author.id;
        const first_confirmation_collector = (await first_confirmation).awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 30000 });

        let to_proceed;

        await first_confirmation_collector.then(async (collected) => {
            if(collected.customId === 'first-confirmation-accept') {
                to_proceed = true;
                await collected.update({ components: [new ActionRowBuilder<ButtonBuilder>().addComponents([first_confirmation_accept.setStyle(ButtonStyle.Success).setDisabled(true), first_confirmation_deny.setStyle(ButtonStyle.Secondary).setDisabled(true)])] });

                return;
            } else if(collected.customId === 'first-confirmation-deny') {
                to_proceed = false;
                await collected.update({ components: [new ActionRowBuilder<ButtonBuilder>().addComponents([first_confirmation_accept.setStyle(ButtonStyle.Secondary).setDisabled(true), first_confirmation_deny.setStyle(ButtonStyle.Success).setDisabled(true)])] });

                return;
            } else {
                to_proceed = false;
                return;
            }
        }).catch((err) => {
            console.log(err);
            message.channel.send({ embeds: [createError(`An error occurred!\n\`${err}\``)] });
            return;
        });

        if(to_proceed !== true) {
            return message.channel.send('OK, guess we\'re not wiping anyone today, stop wasting my time SMH.');
        }

        const last_confirmation_buttons = new ActionRowBuilder<ButtonBuilder>().addComponents([
            last_confirmation_accept,
            last_confirmation_deny,
        ]);
        const last_confirmation = message.channel.send({ embeds: [last_confirmation_embed], components: [last_confirmation_buttons] });

        const last_filter = (button: ButtonInteraction) => (button.customId === 'last-confirmation-accept' || button.customId === 'last-confirmation-deny') && button.user.id === message.author.id;
        const last_confirmation_collector = (await last_confirmation).awaitMessageComponent({ filter: last_filter, componentType: ComponentType.Button, time: 30000 });

        let to_wipe;

        await last_confirmation_collector.then(async (collected) => {
            if(collected.customId === 'last-confirmation-accept') {
                to_wipe = true;
                await collected.update({ components: [new ActionRowBuilder<ButtonBuilder>().addComponents([last_confirmation_accept.setStyle(ButtonStyle.Success).setDisabled(true), last_confirmation_deny.setStyle(ButtonStyle.Secondary).setDisabled(true)])] });

                return;
            } else if(collected.customId === 'last-confirmation-deny') {
                to_wipe = false;
                await collected.update({ components: [new ActionRowBuilder<ButtonBuilder>().addComponents([last_confirmation_accept.setStyle(ButtonStyle.Secondary).setDisabled(true), last_confirmation_deny.setStyle(ButtonStyle.Success).setDisabled(true)])] });

                return;
            } else {
                return;
            }
        }).catch((err) => {
            console.log(err);
            message.channel.send({ embeds: [createError(`An error occurred!\n\`${err}\``)] });
            return;
        });

        if(to_wipe !== true) {
            return message.channel.send('OK, guess we\'re not wiping anyone today, stop wasting my time SMH.');
        }

        try {
            const donation = await donations.findOne({ where: { user_id: target.id } });
            if(!donation) {
                return message.channel.send('There\'s nothing to wipe! Stop wasting my time, SMFH.');
            }

            await donation.destroy();
            return message.reply(`**${target.user.tag}** (\`${target.id}\`)'s stats have been wiped!\nAuthorized by **${message.author.tag}** (\`${message.author.id}\`).`);
        } catch(err) {
            return message.channel.send({ embeds: [createError(`An error occurred!\n\`${err}\``)] });
        }
    },
} as Command;