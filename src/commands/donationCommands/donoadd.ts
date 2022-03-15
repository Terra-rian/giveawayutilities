import { User } from 'discord.js';

import { convertAbbreviatedValue, convertExponentialValue, createError } from '../../assets/functions';
import { donations } from '../../models/donations';
import { Command } from '../../typings/types';

export = {
    name: 'donoadd',
    description: 'Adds a donation amount to a user\'s total.',
    aliases: ['add', 'donationadd'],
    cooldown: 3,
    guildOnly: true,
    roles: ['786354739255705600'],
    execute: async (message, args) => {
        const target = await message.guild!.members.fetch(message.mentions.users.first() as User) || message.guild!.members.cache.get((args as string[])[0]);
        let to_add;

        if(!target || !args) {
            return message.reply({ embeds: [createError('Please make sure to mention a user or provide an ID, and specify how much they donated!')] });
        }

        if(args[1].substring(-1).toLowerCase().includes('k') || args[1].substring(-1).toLowerCase().includes('m') || args[1].substring(-1).toLowerCase().includes('b') || args[1].substring(-1).toLowerCase().includes('t')) {
            to_add = convertAbbreviatedValue(args[1]);
        } else if(args[1].includes('e') || args[1].includes('E')) {
            to_add = convertExponentialValue(args[1]);
        } else {
            to_add = parseInt(args[1]);
        }

        if(to_add <= 0) {
            return message.reply({ embeds: [createError('Please make sure that the donation amount you\'re logging is more than 0 coins!')] });
        }

        try {
            const donation = await donations.findOne({ where: { user_id: target.id } });
            if(!donation) {
                await donations.create({
                    user_id: target.id,
                    donations: to_add,
                });
            } else {
                await donation.increment('donations', { by: to_add });
            }
        } catch(err) {
            return message.reply({ embeds: [createError(`An error occurred:\n\`${err}\``)] });
        }

        return message.reply('Donation logged!');
    },
} as Command;