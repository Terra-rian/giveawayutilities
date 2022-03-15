import { User } from 'discord.js';

import { convertAbbreviatedValue, convertExponentialValue, createError } from '../../assets/functions';
import { donations } from '../../models/donations';
import { Command } from '../../typings/types';

export = {
    name: 'donoremove',
    description: 'Removes a donation from a user\'s total.',
    aliases: ['remove', 'donationremove'],
    cooldown: 3,
    guildOnly: true,
    roles: ['786354739255705600'],
    execute: async (message, args) => {
        const target = await message.guild!.members.fetch(message.mentions.users.first() as User) || message.guild!.members.cache.get((args as string[])[0]);
        let to_remove;

        if(!target || !args) {
            return message.reply({ embeds: [createError('Please make sure to mention a user or provide an ID, and specify how much to remove!')] });
        }

        if(args[1].substring(-1).toLowerCase().includes('k') || args[1].substring(-1).toLowerCase().includes('m') || args[1].substring(-1).toLowerCase().includes('b') || args[1].substring(-1).toLowerCase().includes('t')) {
            to_remove = convertAbbreviatedValue(args[1]);
        } else if(args[1].includes('e') || args[1].includes('E')) {
            to_remove = convertExponentialValue(args[1]);
        } else {
            to_remove = parseInt(args[1]);
        }

        if(to_remove <= 0) {
            return message.reply({ embeds: [createError('Please make sure that the donation removal amount you\'re logging is more than 0 coins!')] });
        }

        try {
            const donation = await donations.findOne({ where: { user_id: target.id } });
            if(!donation) {
                await donations.create({
                    user_id: target.id,
                    donations: to_remove,
                });
            } else {
                await donation.decrement('donations', { by: to_remove });
            }
        } catch(err) {
            return message.reply({ embeds: [createError(`An error occurred:\n\`${err}\``)] });
        }

        return message.reply('Donation removal logged!');
    },
} as Command;