import { MessageEmbed } from 'discord.js';
import { Sequelize } from 'sequelize';

import { createError } from '../../assets/functions';
import { donations } from '../../models/donations';
import { Command } from '../../typings/types';

export = {
    name: 'donotop',
    description: 'Gets the highest donors of the server.',
    aliases: ['top', 'donationtop', 'highest'],
    cooldown: 3,
    guildOnly: true,
    execute: async (message) => {
        const emojis = [
            '🥇',
            '🥈',
            '🥉',
            '🏅',
            '🏅',
            '🏅',
            '🏅',
            '🏅',
            '🏅',
            '🏅',
        ];

        try {
            const top_donations = await donations.findAll({
                limit: 10,
                order: [Sequelize.literal('donations DESC')],
            });

            let top = '';

            top_donations.forEach((donor, i) => {
                top += `${emojis[i]} <@!${donor.get('user_id')}> (\`${donor.get('user_id')}\`) - **${Number(donor.get('donations')).toLocaleString()}** coins\n`;
            });

            const embed = new MessageEmbed()
                .setTitle(`${message.guild!.name}'s Top Donations`)
                .setDescription(top)
                .setColor('RANDOM')
                .setFooter({ text: `Requested by ${message.author.tag}` })
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        } catch(err) {
            return message.reply({ embeds: [createError(`An error occurred:\n\`${err}\``)] });
        }
    },
} as Command;