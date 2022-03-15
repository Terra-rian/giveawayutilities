import { MessageEmbed, User } from 'discord.js';

import { createError } from '../../assets/functions';
import { donations } from '../../models/donations';
import { Command } from '../../typings/types';

export = {
    name: 'donolist',
    description: 'Lists the donations for a specified user.',
    aliases: ['list', 'show', 'donationlist'],
    cooldown: 3,
    guildOnly: true,
    roles: ['786354739255705600'],
    execute: async (message, args) => {
        const target = await message.guild?.members.fetch(message.mentions.users.first() as User) || message.guild?.members.cache.get((args as string[])[0]);
        if(!target) {
            return message.reply({ embeds: [createError('Please mention a target to see their donations!')] });
        }

        try {
            const donation = await donations.findOne({ where: { user_id: target.id } });

            const embed = new MessageEmbed()
                .setTitle(`${target.user.tag}'s Donations`)
                .addField('Info', `<@!${target.id}> (\`${target.id}\`)\nTheir first donation was ${donation?.get('createdAt') ? `at **${donation.get('createdAt')}**` : '**never**.'}`)
                .addField('Donations', `They have donated a total of **${donation?.get('donations') ? `${Number(donation.get('donations')).toLocaleString()}` : '0'}** coins!` || 'They have no donations yet...')
                .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}` });

            return message.reply({ embeds: [embed] });
        } catch(err) {
            return message.reply({ embeds: [createError(`An error occurred:\n\`${err}\``)] });
        }
    },
} as Command;